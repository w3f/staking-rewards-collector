import { gatherData } from './gatherData.js';
import { exportVariable, readJSON } from './fileWorker.js';
import { calculateMetrics, verifyUserInput } from './utils.js';


async function main () {
  let obj = {};

  const userInput = readJSON('config/userInput.json');
  verifyUserInput(userInput);


    console.log('Wait until your data is retrieved...');
    obj = await gatherData(userInput);
    obj = calculateMetrics(obj);
    exportVariable(JSON.stringify(obj), 'output.json'); 
    console.log('Insert the content of output.json into http://jsonviewer.stack.hu/ and click format to make it readable.'); 
}
main().catch(console.error).finally(() => process.exit());