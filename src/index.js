import { gatherData } from './gatherData.js';
import { exportVariable, readJSON, writeCSV, writeOverviewCSV } from './fileWorker.js';
import { calculateMetrics, verifyUserInput, getTicker, checkPriceAvailablilty } from './utils.js';


async function main () {
  let obj = {};
  let csv = [];
  let userInput = readJSON('config/userInput.json');

  let numberPayouts = {
    "DOT": 0,
    "KSM": 0,
    "MOVR":0,
    "GLMR": 0,
    "SDN": 0,
    "ASTR": 0,
    "CFG": 0,
    "KILT": 0,
  }
  let totalStaked = {
    "DOT": 0,
    "KSM": 0,
    "MOVR": 0,
    "GLMR": 0,
    "SDN": 0,
    "ASTR": 0,
    "CFG": 0,
    "KILT": 0,
  }

  let totalFiatToken = {
    "DOT": 0,
    "KSM": 0,
    "MOVR": 0,
    "GLMR": 0,
    "SDN": 0,
    "ASTR": 0,
    "CFG": 0,
    "KILT": 0,
  }

  let totalFiat = 0;


  for(let i = 0; i < userInput.addresses.length; i++){
    verifyUserInput(userInput);
    let network = userInput.addresses[i].network.toLowerCase();
    let priceData = checkPriceAvailablilty(userInput, network);
    let start = userInput.start;
    let end = userInput.end;
    let address = userInput.addresses[i].address;
    let currency = userInput.currency;
    let exportOutput = userInput.exportOutput;
    let startBalance = userInput.addresses[i].startBalance;
    let ticker = getTicker(network);

    obj = await gatherData(start, end, network, address, currency, priceData, startBalance, ticker);

    // otherwise there were no rewards
    if(obj.data.numberRewardsParsed > 0){
      obj = calculateMetrics(obj);
    }

    if(exportOutput == "true" & obj.message != 'No rewards found for this address'){
      exportVariable(JSON.stringify(obj), userInput.addresses[i].name + ' ' + obj.address + '.json');
      writeCSV(obj, userInput.addresses[i].name + ' ' + obj.address + '.csv');
    }
    /*
    Creates an overview csv that holds a summary of all addresses. I need to pass it outside of the previous if-condition because it could be that the last address didn't have any rewards which
    would lead to the fact that the file would never be written. I included a flag in the writeOverviewCSV function to skip writing a line for addresses that have no rewards.
    */
    if(exportOutput == "true"){
    csv = writeOverviewCSV(i, userInput.addresses.length, obj, csv);
    }


    totalFiat = totalFiat + obj.totalValueFiat;

    if(network == "polkadot"){
        totalStaked.DOT = totalStaked.DOT + obj.totalAmountHumanReadable;
        numberPayouts.DOT = numberPayouts.DOT + obj.data.numberRewardsParsed;
        totalFiatToken.DOT = totalFiatToken.DOT + obj.totalValueFiat;
    } else if (network == "kusama") {
        numberPayouts.KSM = numberPayouts.KSM + obj.data.numberRewardsParsed;
        totalStaked.KSM = totalStaked.KSM + obj.totalAmountHumanReadable;
        totalFiatToken.KSM = totalFiatToken.KSM + obj.totalValueFiat;
    } else if (network == "moonriver"){
        numberPayouts.MOVR = numberPayouts.MOVR + obj.data.numberRewardsParsed;
        totalStaked.MOVR = totalStaked.MOVR + obj.totalAmountHumanReadable;
        totalFiatToken.MOVR = totalFiatToken.MOVR + obj.totalValueFiat;
    } else if (network == "moonbeam"){
        numberPayouts.GLMR = numberPayouts.GLMR + obj.data.numberRewardsParsed
        totalStaked.GLMR = totalStaked.GLMR + obj.totalAmountHumanReadable;
        totalFiatToken.GLMR = totalFiatToken.GLMR + obj.totalValueFiat;
    } else if (network == "shiden"){
        numberPayouts.SDN = numberPayouts.SDN + obj.data.numberRewardsParsed
        totalStaked.SDN = totalStaked.SDN + obj.totalAmountHumanReadable;
        totalFiatToken.SDN = totalFiatToken.SDN + obj.totalValueFiat;
    } else if (network == "centrifuge"){
      numberPayouts.CFG = numberPayouts.CFG + obj.data.numberRewardsParsed
      totalStaked.CFG = totalStaked.CFG + obj.totalAmountHumanReadable;
      totalFiatToken.CFG = totalFiatToken.CFG + obj.totalValueFiat;
    } else if (network == "astar"){
      numberPayouts.ASTR = numberPayouts.ASTR + obj.data.numberRewardsParsed
      totalStaked.ASTR = totalStaked.ASTR + obj.totalAmountHumanReadable;
      totalFiatToken.ASTR = totalFiatToken.ASTR + obj.totalValueFiat;
    } else if (network == "kilt"){
    numberPayouts.KILT = numberPayouts.KILT + obj.data.numberRewardsParsed
    totalStaked.KILT = totalStaked.KILT + obj.totalAmountHumanReadable;
    totalFiatToken.KILT = totalFiatToken.KILT + obj.totalValueFiat;
    }
  }


  console.log('The following table lists all found rewards and values are expressed in ' + obj.currency);


  const DOT = {"Name": "DOT", "Nr. Payouts": numberPayouts.DOT, "Number of Tokens": totalStaked.DOT, "Value": totalFiatToken.DOT};
  const KSM = {"Name": "KSM", "Nr. Payouts": numberPayouts.KSM, "Number of Tokens": totalStaked.KSM, "Value": totalFiatToken.KSM};
  const GLMR = {"Name": "GLMR", "Nr. Payouts": numberPayouts.GLMR, "Number of Tokens": totalStaked.GLMR, "Value": totalFiatToken.GLMR}
  const MOVR = {"Name": "MOVR", "Nr. Payouts": numberPayouts.MOVR, "Number of Tokens": totalStaked.MOVR, "Value": totalFiatToken.MOVR};
  const SDN = {"Name": "SDN", "Nr. Payouts": numberPayouts.SDN, "Number of Tokens": totalStaked.SDN, "Value": totalFiatToken.SDN};
  const ASTR = {"Name": "ASTR", "Nr. Payouts": numberPayouts.ASTR, "Number of Tokens": totalStaked.ASTR, "Value": totalFiatToken.ASTR};
  const CFG = {"Name": "CFG", "Nr. Payouts": numberPayouts.CFG, "Number of Tokens": totalStaked.CFG, "Value": totalFiatToken.CFG};
  const KILT = {"Name": "KILT", "Nr. Payouts": numberPayouts.KILT, "Number of Tokens": totalStaked.KILT, "Value": totalFiatToken.KILT};



  console.table([DOT, KSM, GLMR, MOVR, ASTR, SDN, CFG, KILT]);
  console.log('The total value of all payouts is ' + totalFiat + ' ' + obj.currency + ' (based on daily prices).');
  console.log('For more information, open the CSV file(s) or copy the content of the JSON file(s) into http://jsonviewer.stack.hu/ (click format).');
}
main().catch(console.error).finally(() => process.exit());
