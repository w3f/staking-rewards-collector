import curl from 'curlrequest';
import { exportVariable } from './writer.js';
import { dateToString } from './utils.js';

let testArray = ['03-11-2020', '04-11-2020', '05-11-2020'];

requestStakingRewards(testArray);

export async function requestStakingRewards(daysArray){
    let found = 0;
    let object = {};
    // Make at least one call
    // check for Number of entries... take modula -> thats the max. amount you have to search
    // go backwards in the DaysArray and 

    // While 
    // let stop = false;

    // do {
        
    // } while (stop == false) 

    var options = {
        url: 'https://polkadot.subscan.io/api/scan/account/reward_slash',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
        'row':100,
        'page':0,
        'address': '14Yn8uzpfsz326xULJF47NGcTR8PKDhM83MEkzCPFsEUa7ab'
        }),
      };
   let stakingObject = await curlRequest(options);
   stakingObject = JSON.parse(stakingObject);
   //exportVariable(data);


   for(let i=1; i < daysArray.length; i++){
       for(let x = 1; x < stakingObject.data.count; x++){
        let tmp = dateToString(new Date(stakingObject.data.list[x].block_timestamp * 1000));
            if(tmp == daysArray[i]){
                found += 1; 
                // add to object
            }
        }
    }
    console.log(found);
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

function unixTimeToFullDay(unixTimeStamp){
    let unixTime = unixTimeStamp*1000;
    let date = new Date(unixTime);

}

