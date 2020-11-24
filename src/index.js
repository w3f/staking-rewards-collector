import { gatherData } from './gatherData.js';
import { exportVariable, readJSON } from './fileWorker.js';
import { calculateMetrics } from './utils.js';


async function main () {
  let obj = {};

  const userInput = readJSON('config/userInput.json');
  console.log('Wait until your data is retrieved...');

  obj = await gatherData(userInput);
  obj = calculateMetrics(obj);
  exportVariable(JSON.stringify(obj), 'output.json');
}
main().catch(console.error).finally(() => process.exit());
