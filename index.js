const { ApiPromise, WsProvider } = require('@polkadot/api');
const CoinGecko = require('coingecko-api');

function makeDaysArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

/* var daylist = getDaysArray(new Date(start),new Date(end));
daylist.map((v)=>v.toISOString().slice(0,10)).join("") */

function dateToString(date){
  day = date.getDate().toString();
  month = (date.getMonth() + 1).toString();
  year = date.getFullYear().toString();

  if(day.length == 1){
    day = day.concat('0');
    day = reverseString(day);
  }

  if(month.length == 1){
    month = month.concat('0');
    month = reverseString(month);
  }
  return day.concat('-', month, '-', year);
}

function transformArrayToString(array){
  new_array = [];

  for(i = 0; i < array.length; i++){
    new_array[i] = dateToString(array[i]);
  }
  return new_array;
}

function reverseString(string){
  var i;
  length = string.length;
  var tmp_string = '';

  for(i = 0; i < string.length; i++){
    tmp_string = tmp_string.concat(string[length-1]);
    length -= 1;
  }
  return tmp_string;
}

async function getDailyPrice(date){
  date_string = dateToString(date);
  
  let polkadot = await CoinGeckoClient.coins.fetchHistory('polkadot', {
    date: date_string
  });

  return polkadot.data.market_data.current_price.chf;

}

function makePriceDictionary(date_array, price_array){
  var keys = date_array;
  var values = price_array;
  var result = {};
  keys.forEach((key, i) => result[key] = values[i]);

  return result
}

// }

// TODO
/* async function generateDatePriceDictionairy(year, coin){

  let handler = await CoinGeckoClient.coins.fetchHistory(coin, {date});
  console.log('Successfull');
} */

async function main () {

  const CoinGeckoClient = new CoinGecko();
  const ADDR = '15wqXZqwCkkpHox8u1a5D8oHw3t57pDP7SK1YHQbPGrXrhaj';
  const YEAR = '2020';
  const COIN = 'polkadot';
  const START = YEAR.concat('-10-10'); // only for 2020
  const END = YEAR.concat('-11-08'); // should be today if within tax year or 12-31 if after -> do in UI
  let date_array = [];
  let price_array = [];

  date_array = makeDaysArray(new Date(START),new Date(END));
  //console.log(array);
  date_array = transformArrayToString(date_array);
  
  console.log(date_array);

   // CoinGecko API
   for(i=0; i<date_array.length; i++){
    let price_call = await CoinGeckoClient.coins.fetchHistory('polkadot', {
      date: date_array[i]
    });
    price_array[i] = price_call.data.market_data.current_price.chf;
   }

   dictionary = makePriceDictionary(date_array, price_array);

        

    // Polkadot API

  // Initialise the provider to connect to the local node
  const provider = new WsProvider('wss://rpc.polkadot.io');

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  // Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & nonce via the system module
const { nonce, data: balance } = await api.query.system.account(ADDR);

console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

}

main().catch(console.error).finally(() => process.exit());
