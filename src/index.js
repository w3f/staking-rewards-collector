import { MockUserInput } from './ui.js';
import { gatherData } from './gatherData.js';
import { exportVariable } from './writer.js';

function makePriceDictionary(date_array, price_array){
  var keys = date_array;
  var values = price_array;
  var result = {};
  keys.forEach((key, i) => result[key] = values[i]);

  return result
}


async function main () {
  let obj = {};
  const userInput = MockUserInput();

  console.log('Wait until your data is retrieved...')
  obj = await gatherData(userInput);
  exportVariable(JSON.stringify(obj), 'output.json');
}
main().catch(console.error).finally(() => process.exit());
