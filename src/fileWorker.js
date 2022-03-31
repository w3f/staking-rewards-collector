import fs from 'fs';

let userInput = readJSON('config/userInput.json');
let outputDir = userInput.exportPrefix === undefined ? "" : userInput.exportPrefix;

export function exportVariable(data, name){
  try {
    fs.writeFileSync(outputDir+name, data);
  } catch (err) {
    console.error(err);
  }
}

export function readJSON(filePath) {
  const rawContent = fs.readFileSync(filePath);
  return JSON.parse(rawContent);
}

export function writeCSV(obj, name) {
  const filename = name;

  try {
    fs.writeFileSync(outputDir+filename, extractAsCSV(obj));
  } catch (err) {
    console.error(err);
  }
}

function extractAsCSV(obj) {
  const header = [
    `Prices from CoinGecko & Staking Rewards from Subscan.io\n` +
    `Day,Price in ${obj.currency},Daily Volume in ${obj.currency},Staking Rewards in ${obj.ticker},Number of Payouts,Value in Fiat`
  ];

  const rows = obj.data.list
    .filter(entry => entry.numberPayouts > 0)
    .map(entry => `${entry.day}, ${entry.price}, ${entry.volume}, ${entry.amountHumanReadable}, ${entry.numberPayouts}, ${entry.valueFiat}`);

  return header.concat(rows).join("\n");
}

/**
 * This function creates an overview csv that holds aggregated information about the addresses. I am
 * passing back and forth the csv that gets enriched with every loop in index.js. When the loop
 * ends, i.e., when `i == i_max`, then the csv is written.
 */
export function writeOverviewCSV(i, i_max, obj, csv) {

  const filename = 'Overview.csv';
  var row;
  const header = [
    `Prices from CoinGecko & Staking Rewards from Subscan.io\n` +
    `Address,Network,Ticker,Number of Tokens,Value in ${obj.currency}`
  ];

  /*
    We check here if there were any rewards in the obj. If not, we do not want to write a line into
    the overview csv. However, we cannot just skip this function, because we an empty address could
    be the first entry (which then require to have the header written) or the last entry (which
    would write the file). Therefore, we simply write an empty string.
  */

  if (obj.message == 'No rewards found for this address') {
    row = '';
  } else {
    row = `${obj.address},${obj.network.toUpperCase()},${obj.ticker},${obj.totalAmountHumanReadable},${obj.totalValueFiat}\n`;
  }

  // If it is the first address that has been parsed, we want to create the overview csv
  if (i == 0) {
    csv = header.concat(row).join("\n");
  }

  if (i > 0) {
    csv += row;
  }

  if (i == (i_max-1)) {
    try {
      fs.writeFileSync(outputDir+filename, csv);
    } catch (err) {
      console.error(err);
    }
  }
  return csv;
}
