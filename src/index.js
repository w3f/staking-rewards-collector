import { gatherData } from './gatherData.js';
import { exportVariable, readJSON, writeCSV } from './fileWorker.js';
import { calculateMetrics, verifyUserInput } from './utils.js';


async function main () {
  let obj = {};

  let userInput = readJSON('config/userInput.json');
  userInput = verifyUserInput(userInput);


    console.log('Wait until your data is retrieved...');
    obj = await gatherData(userInput);
    obj = calculateMetrics(obj);
    exportVariable(JSON.stringify(obj), 'output-' + obj.address + '.json'); 
    writeCSV(obj, 'output-' + obj.address + '.csv');

    console.log('In total, ' + obj.data.numberRewardsParsed + ' rewards were found and the staking rewards sum up to ' +  obj.totalAmountHumanReadable + ((obj.network == 'polkadot') ? ' DOT' : ' KSM') + '.') ;
    console.log('For more information, open the CSV file or copy the content of the JSON file into http://jsonviewer.stack.hu/ (click format).'); 
}
main().catch(console.error).finally(() => process.exit());