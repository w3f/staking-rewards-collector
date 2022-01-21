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
    "GLMR": 0,
    "SDN": 0,
    "ASTR": 0,
  }
  let totalStaked = {
    "DOT": 0,
    "KSM": 0,
    "MOVR": 0,
    "GLMR": 0,
    "SDN": 0,
    "ASTR": 0,
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
    } else if (network == "moonbeam"){
        numberPayouts.GLMR = numberPayouts.GLMR + obj.data.numberRewardsParsed
        totalStaked.GLMR = totalStaked.GLMR + obj.totalAmountHumanReadable;
    } else if (network == "shiden"){
        numberPayouts.SDN = numberPayouts.SDN + obj.data.numberRewardsParsed
        totalStaked.SDN = totalStaked.SDN + obj.totalAmountHumanReadable;
    } else if (network == "astar"){
      numberPayouts.ASTR = numberPayouts.ASTR + obj.data.numberRewardsParsed
      totalStaked.ASTR = totalStaked.ASTR + obj.totalAmountHumanReadable;
    }
  }

    
  console.log('The following table lists all found rewards and values are expressed in ' + obj.currency);


  const DOT = {"Name": "DOT", "Nr. Payouts": numberPayouts.DOT, "Value": totalStaked.DOT};
  const KSM = {"Name": "KSM", "Nr. Payouts": numberPayouts.KSM, "Value": totalStaked.KSM};
  const GLMR = {"Name": "GLMR", "Nr. Payouts": numberPayouts.GLMR, "Value": totalStaked.GLMR}
  const MOVR = {"Name": "MOVR", "Nr. Payouts": numberPayouts.MOVR, "Value": totalStaked.MOVR};
  const SDN = {"Name": "SDN", "Nr. Payouts": numberPayouts.SDN, "Value": totalStaked.SDN};
  const ASTR = {"Name": "ASTR", "Nr. Payouts": numberPayouts.ASTR, "Value": totalStaked.ASTR};


  
  console.table([DOT, KSM, GLMR, MOVR, ASTR, SDN]);
  console.log('The total value of all payouts is ' + totalFiat + ' ' + obj.currency + ' (based on daily prices).');
  console.log('For more information, open the CSV file(s) or copy the content of the JSON file(s) into http://jsonviewer.stack.hu/ (click format).'); 
}
main().catch(console.error).finally(() => process.exit());