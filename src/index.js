import { gatherData } from './gatherData.js';
import { readJSON, writeCSV, writeOutput, writeOverviewCSV } from './fileWorker.js';
import { getSupportedNetworks, getTicker, checkPriceAvailablilty } from './networks.js';
import { calculateMetrics, verifyUserInput } from './utils.js';
import { API_SLEEP_DELAY } from './const.js';

function initNetworkData(networks) {
  let networkInfo = {};
  for (const network of networks) {
    networkInfo[network] = {
      token: getTicker(network),
      numberPayouts: 0,
      totalStaked: 0,
      totalFiatToken: 0,
    };
  }
  return networkInfo;
}

function updateNetwork(networkStakingInfo, stakingData) {
  networkStakingInfo.numberPayouts += stakingData.data.numberRewardsParsed;
  networkStakingInfo.totalStaked += stakingData.totalAmountHumanReadable;
  networkStakingInfo.totalFiatToken += stakingData.totalValueFiat;
  return networkStakingInfo;
}

async function main () {
  let obj = {};
  let csv = [];
  let userInput = readJSON('config/userInput.json');

  let networkInfo = initNetworkData(getSupportedNetworks());

  let totalFiat = 0;

  verifyUserInput(userInput);
  let start = userInput.start;
  let end = userInput.end;
  let currency = userInput.currency;
  let exportOutput = userInput.exportOutput;
  let subscan_apikey = userInput.subscan_apikey;
  let priceApi = userInput.priceApi;
  const apiSleepDelay = userInput.apiSleepDelay? userInput.apiSleepDelay: API_SLEEP_DELAY;

  for (let i = 0; i < userInput.addresses.length; i++) {
    let network = userInput.addresses[i].network.toLowerCase();
    let addressName = userInput.addresses[i].name;
    let priceData = checkPriceAvailablilty(userInput, network);
    let address = userInput.addresses[i].address;
    let startBalance = userInput.addresses[i].startBalance;
    let ticker = getTicker(network);

    obj = await gatherData(start, end, network, addressName, address, currency, priceData, startBalance, ticker, subscan_apikey, apiSleepDelay, priceApi);

    // otherwise there were no rewards
    if (obj.data.numberRewardsParsed > 0) {
      obj = calculateMetrics(obj);
    }

    if (exportOutput == "true" & obj.message != 'No rewards found for this address') {
      writeOutput(`${addressName} ${obj.address}.json`, JSON.stringify(obj));
      writeCSV(obj, `${addressName} ${obj.address}.csv`, priceApi);
    }

    /*
      Creates an overview csv that holds a summary of all addresses. I need to pass it outside of
      the previous if-condition because it could be that the last address didn't have any rewards
      which would lead to the fact that the file would never be written. I included a flag in the
      `writeOverviewCSV` function to skip writing a line for addresses that have no rewards.
    */
    if (exportOutput == "true") {
      csv = writeOverviewCSV(i, userInput.addresses.length, obj, csv);
    }

    totalFiat += obj.totalValueFiat;

    if (network in networkInfo) {
      networkInfo[network] = updateNetwork(networkInfo[network], obj);
    }
  }

  let tableArray = [];
  for (const network of Object.keys(networkInfo)) {
    tableArray.push({
      'Name': networkInfo[network].token,
      'Num. Payouts': networkInfo[network].numberPayouts,
      'Number of Tokens': networkInfo[network].totalStaked,
      'Value': networkInfo[network].totalFiatToken,
    });
  }

  console.log('\nThe following table lists all found rewards and values are expressed in ' + obj.currency + '.');
  console.log('\nRewards are calculated between ' + userInput.start + ' and ' + userInput.end + '.');
  console.table(tableArray);
  console.log('The total value of all payouts is ' + totalFiat + ' ' + obj.currency + ' (based on daily prices using ' + obj.priceApi + ' API).');
  console.log('For more information, open the CSV file(s) or copy the content of the JSON file(s) into http://jsonviewer.stack.hu/ (click format).');
}
main().catch(console.error).finally(() => process.exit());
