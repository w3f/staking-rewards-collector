import { getUserInput, MockUserInput } from './ui.js';
import { gatherData } from './gatherData.js';
import { exportVariable } from './writer.js';
import { calculateMetrics } from './utils.js';

async function main () {
  let obj = {};

  // for testing only
  //const userInput = MockUserInput();
  
  const userInput = await getUserInput();

  console.log('Wait until your data is retrieved...')
  obj = await gatherData(userInput);
  obj = calculateMetrics(obj);
  exportVariable(JSON.stringify(obj), 'output.json');
}
main().catch(console.error).finally(() => process.exit());
