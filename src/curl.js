import curl from 'curlrequest';
import { getSubscanName } from './networks.js';
import { dateToString, transformDDMMYYYtoUnix, min, sleep } from './utils.js';

export async function addStakingData(obj){
    const SLEEP_DELAY=100;
    let found = 0;
    let stakingObject = {};
    var finished;
    let page = -1;
    let address = obj.address;
    let network = getSubscanName(obj.network);
    let subscan_apikey = obj.subscan_apikey;
    var loopIndex;
    let round = 0;

    /*
    This function runs at least once and parses the staking info for the given address. The API is structured in a way that you specify which
    page is shown (probably like in the webpage). There is a maximum of 100 entries per page and the first page is 0. The following loop has two
    for loops. The two loops compare every day of the object (by the user) with all entries of the staking object. This is necessary since you can
    have multiple rewards per day (so it is not enough to stop once you found a match). After both loops are finished, we have to check whether we need
    to make an additional API call. To check, we check if there is a date in the staking rewards (by the API) at least one day newer than the last day of the
    specified range of the user. Only then can we be sure that we have all the data. If this is not the case, we parse the next 100 entries of the next page.
     */

    do {
        page += 1;
        round += 1;
        stakingObject = await getStakingObject(address, page, network, subscan_apikey);
        // Delay to avoid hitting API rate limit
        await sleep(SLEEP_DELAY);

        // Break loop if none rewards have been found for the address.
        if(stakingObject.data == undefined || stakingObject.data.count == 0 || stakingObject.data.list === null){
            break;
        }

        if(page==0){
            loopIndex = min(stakingObject.data.count, 100);
        } else {
            loopIndex = min(stakingObject.data.count - page*100,100);
        }

        for(let i=0; i < obj.data.numberOfDays; i++){
            for(let x = 0; x < loopIndex; x++){
                let tmp = dateToString(new Date(stakingObject.data.list[x].block_timestamp * 1000));
                if(tmp == obj.data.list[i].day & stakingObject.data.list[x].event_id == "Reward"){
                    found += 1;

                    let amountPlanks = parseInt(stakingObject.data.list[x].amount);
                    obj.data.list[i].payouts.push({
                        amountPlanks: amountPlanks,
                        blockNumber: stakingObject.data.list[x].block_num,
                        extrinsicHash: stakingObject.data.list[x].extrinsicHash,
                        timestamp: stakingObject.data.list[x].block_timestamp,
                    });

                    obj.data.list[i].amountPlanks += amountPlanks;
                }
            }
        }
        finished = checkIfEnd(stakingObject, obj.data.list[0].day, loopIndex);
    } while (finished == false);

    obj.data.numberRewardsParsed = found;

    obj.message = 'data collection complete';

    if (obj.data.numberRewardsParsed == 0) {
        console.log(obj.network + ': No rewards found to parse for address ' + obj.name + ': ' + obj.address);
        obj.message = 'No rewards found for this address';
    }
   
    return obj;  
}
/*
This function checks if the loop should continue. It should continue whenever the last day retrieved by the staking object retrieved has a larger
value (i.e. lies more towards the present) than the last day of the desired point to look into. In addition, the staking object needs to be full, so
we know that there potentially are more rewards to get.
*/

function checkIfEnd(stakingObj, lastDay, loopIndex){
    let finished = true;
    let lastDayStakingObj = stakingObj.data.list.slice(-1)[0].block_timestamp;

    if(transformDDMMYYYtoUnix(lastDay) < lastDayStakingObj && loopIndex == 100){
        finished = false;
    }
    return finished;
}

async function getStakingObject(address, page, network, subscan_apikey){
    const SLEEP_DELAY=100;
    
    let breakPoint = 0;
    let continueLoop = true;

    let stakingObject = {};
    
    let url = 'https://' + network + '.api.subscan.io/api/scan/account/reward_slash';

    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': subscan_apikey
        },
        data: JSON.stringify({
        'row':100,
        'page': page,
        'address': address
        }),
    };

    // Sometimes the staking object is not properly transmitted. We try it again 10 times.
    while( continueLoop & breakPoint < 10 ) {
        stakingObject = await curlRequest(options);
            try {
                stakingObject = JSON.parse(stakingObject);
                continueLoop = false;
            } catch(e) {
                breakPoint += 1;
            }

        if (stakingObject.message == 'API rate limit exceeded') {
            // Delay to avoid hitting API rate limit
            await sleep(SLEEP_DELAY);
            continueLoop = true;
        }
    }
    return stakingObject;
}

async function curlRequest(options){
    return new Promise(function (resolve, reject){
      curl.request(options, (err,data) => {
        if (!err){
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
}
