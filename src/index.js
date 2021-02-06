import { gatherData } from './gatherData.js';
import { exportVariable, readJSON, writeCSV } from './fileWorker.js';
import { calculateMetrics, verifyUserInput, getNetwork } from './utils.js';


async function main () {
  let obj = {};
  let userInput = readJSON('config/userInput.json');

  let numberPayouts = {
    "DOT": 0,
    "KSM": 0,
  }
  let totalStaked = {
    "DOT": 0,
    "KSM": 0,
  }


  for(let i = 0; i < userInput.addresses.length; i++){
    userInput = verifyUserInput(userInput);
    let start = userInput.start;
    let end = userInput.end;
    let network = getNetwork(userInput.addresses[i].address);
    let address = userInput.addresses[i].address;
    let currency = userInput.currency;
    let incomeTax = userInput.incomeTax;
    let priceData = userInput.priceData;
    let initialInvestment = userInput.addresses[i].initialInvestment;

    obj = await gatherData(start, end, network, address, currency, incomeTax, priceData, initialInvestment);
    obj = calculateMetrics(obj);
    exportVariable(JSON.stringify(obj), userInput.addresses[i].name + ' ' + obj.address + '.json'); 
    writeCSV(obj, userInput.addresses[i].name + ' ' + obj.address + '.csv');


    if(network == "polkadot"){
      totalStaked.DOT = totalStaked.DOT + obj.totalAmountHumanReadable;
      numberPayouts.DOT = numberPayouts.DOT + obj.data.numberRewardsParsed;
    } else {
      numberPayouts.KSM = numberPayouts.KSM + obj.data.numberRewardsParsed;
      totalStaked.KSM = totalStaked.KSM + obj.totalAmountHumanReadable;
    }
  }
    console.log('In total, ' + numberPayouts.DOT + ' DOT and ' + numberPayouts.KSM + ' KSM payouts were found.');
    console.log('The sum of staking rewards are ' + totalStaked.DOT +  ' DOT and ' + totalStaked.KSM + ' KSM');
    console.log('For more information, open the CSV file or copy the content of the JSON file into http://jsonviewer.stack.hu/ (click format).'); 
}
main().catch(console.error).finally(() => process.exit());