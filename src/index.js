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
    console.log('In total, ' + obj.data.numberRewardsParsed + ' rewards were found and the staking rewards sum up to ' +  obj.totalAmountHumanReadable + ((obj.network == 'polkadot') ? ' DOT' : ' KSM') + ' .') ;
    console.log('For more information, copy the content of output.json into http://jsonviewer.stack.hu/ and click format.'); 
}
main().catch(console.error).finally(() => process.exit());