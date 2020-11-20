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

  console.log('Wait until your data is retrieved...')
  await gatherData(userInput.start, userInput.end, userInput.coin, userInput.address);

  // let start_unix = start.valueOf() / 1000;
  // let end_unix = end.valueOf() / 1000;

}
main().catch(console.error).finally(() => process.exit());
