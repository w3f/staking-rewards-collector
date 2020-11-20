import curl from 'curlrequest';
import fs from 'fs';
import { MockUserInput } from './ui.js';
import { gatherData } from './gatherData.js';




function makePriceDictionary(date_array, price_array){
  var keys = date_array;
  var values = price_array;
  var result = {};
  keys.forEach((key, i) => result[key] = values[i]);

  return result
}


async function main () {

  const userInput = MockUserInput();

  await gatherData(userInput.start, userInput.end, userInput.coin, userInput.address);

  // let start_unix = start.valueOf() / 1000;
  // let end_unix = end.valueOf() / 1000;
  
  

  console.log('\n Please wait for the data to be fetched');

  



  // var options = {
  //     url: 'https://polkadot.subscan.io/api/scan/account/reward_slash',
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     data: JSON.stringify({
  //     'row':100,
  //     'page':0,
  //     'address': ADDR
  //     }),
  //   };
    

  //   let data = await requestStakingRewards(options);

  // try {
  //     fs.writeFileSync('user.json', data);
  //     console.log("JSON data is saved.");
  // } catch (error) {
  //     console.error(err);
  // }

}

function requestStakingRewards(options){
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
main().catch(console.error).finally(() => process.exit());
