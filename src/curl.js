import curl from 'curlrequest';
import { dateToString, transformDDMMYYYtoUnix, min } from './utils.js';
import { exportVariable } from './writer.js';

export async function addStakingData(obj){
    let found = 0;
    let stakingObject = {};
    var finished;
    let page = -1;
    let address = obj.address;
    let network = obj.network;
    let round = 0;
    var loopindex;

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
        stakingObject = await getStakingObject(address, page, network);
        if(page==0){
            loopindex = min(stakingObject.data.count, 100);
        } else {
            loopindex = min(stakingObject.data.count - page*100,100);
        }       
        for(let i=0; i < obj.data.numberOfDays; i++){
            for(let x = 0; x < loopindex; x++){
                let tmp = dateToString(new Date(stakingObject.data.list[x].block_timestamp * 1000));
                    if(tmp == obj.data.list[i].day){
                        found += 1;
                        // if we already filled out the entries of a specific day. We then just concanate strings or add values. 
                        if(obj.data.list[i].numberPayouts >= 1){
                            obj.data.list[i].amountPlanks = obj.data.list[i].amountPlanks + parseInt(stakingObject.data.list[x].amount);
                            obj.data.list[i].numberPayouts = obj.data.list[i].numberPayouts + 1;
                            obj.data.list[i].blockNumber = obj.data.list[i].blockNumber + ' and ' + stakingObject.data.list[x].block_num;
                            obj.data.list[i].extrinsicHash = obj.data.list[i].extrinsicHash + ' and ' + stakingObject.data.list[x].extrinsic_hash;
                        // if an entrie has only the default values we add the ones from the staking object.
                        } else {
                            obj.data.list[i].amountPlanks = parseInt(stakingObject.data.list[x].amount); 
                            obj.data.list[i].numberPayouts = obj.data.list[i].numberPayouts + 1;
                            obj.data.list[i].blockNumber = stakingObject.data.list[x].block_num;
                            obj.data.list[i].extrinsicHash = stakingObject.data.list[x].extrinsic_hash;
                        }
                    }
                }
            } 
        finished = checkIfEnd(stakingObject, obj, loopindex);
        } while (finished == false);

    
    obj.data.numberRewardsParsed = found;
    obj.message = 'data collection complete';
    return obj;  
}
/*
This function checks if the loop should continue. If the last entry (i.e. the longest date in history) of stakingObject has a smaller timestamp
than that of the user specified one, it should continue, because there might be more rewards beyond that date. However, for that to be true, the
staking object must have 100 entries (which basically means that there are more to come).
*/
function checkIfEnd(stakingObj, obj, loopindex){
    let endStakingObj = stakingObj.data.list.slice(-1)[0].block_timestamp;
    let endObj = transformDDMMYYYtoUnix(obj.data.list.slice(-1)[0].day);
    
    let finished = true;

    if((endStakingObj < endObj) && loopindex == 100){
        finished = false;
    }
    return finished;
}

async function getStakingObject(address, page, network){
    let stakingObject = {};
    var url;

    if(network == 'polkadot'){
        url = 'https://polkadot.subscan.io/api/scan/account/reward_slash'
    } else {
        url = 'https://kusama.subscan.io/api/scan/account/reward_slash'
    } 

    var options = {
        url: url,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
        'row':100,
        'page': page,
        'address': address
        }),
      };
     stakingObject = await curlRequest(options);
    
    return JSON.parse(stakingObject);    
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

