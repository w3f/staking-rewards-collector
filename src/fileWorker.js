import fs from 'fs';

/**
 * Create the user-specified output directory, if it doesn't exist.
 * 
 * @param outputDir - The output directory, referenced relative to where this program is executing.
 */
function createOutputDir(outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
}

/**
 * Read a JSON file from disk.
 * 
 * @param filePath - string, file to read, referenced relative to where this program is executing.
 * @returns the data as an object.
 */
export function readJSON(filePath) {
  const rawContent = fs.readFileSync(filePath);
  return JSON.parse(rawContent);
}

/**
 * Write some data to a file on disk.
 * 
 * @param fname - string, filename to be placed in user-specified output directory.
 * @param data  - data to write to the file.
 */
export function writeOutput(fname, data) {
  let userInput = readJSON('config/userInput.json');
  let outputDir = userInput.exportPrefix === undefined ? "" : userInput.exportPrefix;

  try {
    if (outputDir != "") {
      createOutputDir(outputDir);
    }
    fs.writeFileSync(outputDir + fname, data);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Write an address's staking rewards to a CSV.
 * 
 * @param obj - data object to write
 * @param fname - string, filename (including .csv)
 * @param priceprovider - string, name of price provider
 */
export function writeCSV(obj, fname, priceprovider) {
  writeOutput(fname, extractAsCSV(obj, priceprovider));
}

function extractAsCSV(obj, priceprovider) {
  const header = [
    `Day, Price in ${obj.currency}, ` +
    `Daily Volume in ${obj.currency}, ` +
    `Staking Rewards in ${obj.ticker}, ` +
    `Payout Block Number, ` +
    `Payout Block Timestamp, ` +
    `Value in Fiat, ` +
    `EventID`
  ];
  
  let rows = [];

  for (let d=0; d<obj.data.list.length; d++) {
    let day = obj.data.list[d];

    let dayRows = day.payouts
      .filter(payout => payout.amountPlanks > 0)
      .map(entry => `${day.day}, ${day.price}, ${day.volume}, ${entry.amountHumanReadable}, ${entry.blockNumber}, ${entry.timestamp}, ${entry.valueFiat}, ${entry.eventIndex}`);

    rows.push(...dayRows);
  }

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
    `Address,Network,Name,Ticker,Number of Tokens,Value in ${obj.currency}`
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
    row = `${obj.address},${obj.network.toUpperCase()},${obj.name},${obj.ticker},${obj.totalAmountHumanReadable},${obj.totalValueFiat}\n`;
  }

  // If it is the first address that has been parsed, we want to create the overview csv
  if (i == 0) {
    csv = header.concat(row).join("\n");
  }

  if (i > 0) {
    csv += row;
  }

  if (i == (i_max-1)) {
    writeOutput(filename, csv)
  }
  return csv;
}
