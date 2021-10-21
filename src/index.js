import { gatherData } from './gatherData.js';
import { exportVariable, readJSON, writeCSV } from './fileWorker.js';
import { calculateMetrics, verifyUserInput, getTicker } from './utils.js';


async function main () {
  let obj = {};
  let userInput = readJSON('config/userInput.json');

  let numberPayouts = {
    "DOT": 0,
    "KSM": 0,
    "MOVR":0,
  }
  let totalStaked = {
    "DOT": 0,
    "KSM": 0,
    "MOVR": 0,
  }

  let totalFiat = 0;


  for(let i = 0; i < userInput.addresses.length; i++){
    let network = userInput.addresses[i].network.toLowerCase();
    userInput = verifyUserInput(userInput, network);
    let start = userInput.start;
    let end = userInput.end;
    
    let address = userInput.addresses[i].address;
   
    let currency = userInput.currency;
    let exportOutput = userInput.exportOutput;
    let priceData = userInput.priceData;
    let startBalance = userInput.addresses[i].startBalance;
    let ticker = getTicker(network);

    obj = await gatherData(start, end, network, address, currency, priceData, startBalance);
    
    // otherwise there were no rewards
    if(obj.data.numberRewardsParsed > 0){
      obj = calculateMetrics(obj);
    }

    if(exportOutput == "true" & obj.message != 'No rewards found for this address'){ 
      exportVariable(JSON.stringify(obj), userInput.addresses[i].name + ' ' + obj.address + '.json'); 
      writeCSV(obj, userInput.addresses[i].name + ' ' + obj.address + '.csv');
    }

    totalFiat = totalFiat + obj.totalValueFiat;

    if(network == "polkadot"){
      totalStaked.DOT = totalStaked.DOT + obj.totalAmountHumanReadable;
      numberPayouts.DOT = numberPayouts.DOT + obj.data.numberRewardsParsed;
    } else if (network == "kusama") {
      numberPayouts.KSM = numberPayouts.KSM + obj.data.numberRewardsParsed;
      totalStaked.KSM = totalStaked.KSM + obj.totalAmountHumanReadable;
    } else if (network == "moonriver"){
      numberPayouts.MOVR = numberPayouts.MOVR + obj.data.numberRewardsParsed;
      totalStaked.MOVR = totalStaked.MOVR + obj.totalAmountHumanReadable;
    }
  }
    console.log('In total, ' + numberPayouts.DOT + ' DOT, ' + numberPayouts.KSM + ' KSM, '  + numberPayouts.MOVR + ' MOVR payouts were found.');
    console.log('The sum of staking rewards are ' + totalStaked.DOT +  ' DOT, ' + totalStaked.KSM + ' KSM, ' + totalStaked.MOVR + ' MOVR' + ', which sums up to a total of ' + totalFiat + ' ' + obj.currency + ' (based on daily prices)');
    console.log('For more information, open the CSV file(s) or copy the content of the JSON file(s) into http://jsonviewer.stack.hu/ (click format).'); 
}
main().catch(console.error).finally(() => process.exit());