import { getUserInput, MockUserInput } from './ui.js';
import { gatherData } from './gatherData.js';
import { exportVariable } from './writer.js';
import { calculateMetrics } from './utils.js';

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
  //const userInput = await getUserInput();

  console.log('Wait until your data is retrieved...')
  obj = await gatherData(userInput);
  obj = calculateMetrics(obj);
  exportVariable(JSON.stringify(obj), 'output.json');
}
main().catch(console.error).finally(() => process.exit());
