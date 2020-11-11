const { ApiPromise, WsProvider } = require('@polkadot/api');
const CoinGecko = require('coingecko-api');
const prompts = require('prompts');

function makeDaysArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

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


async function main () {

  const CoinGeckoClient = new CoinGecko();
  const ADDR = '15wqXZqwCkkpHox8u1a5D8oHw3t57pDP7SK1YHQbPGrXrhaj';
  let date_array = [];
  let price_array = [];

  console.log('-------------------------------------------- WELCOME ----------------------------------------------\n');
  console.log('I do not take any responsibility for the correctness of the results, do your own research!!');
  console.log('This tool should help you to request your staking rewards for a given address and calculate your tax burden.');
  console.log('It will be possible for you to insert your Address and the time-frame for which the staking rewards should be calculated.');
  console.log('The daily prices are requested from the CoinGecko API and the staking rewards from Polkastats GraphQL.\n');

  const response_address = await prompts({
    type: 'text',
    name: 'address',
    message: 'Please enter the address you want to look up the staking rewards for (ctrl+shift+v): '
  });
  address = response_address.address;

  const response_coin = await prompts({
    type: 'text',
    name: 'coin',
    message: 'Enter the coin you want to get the rewards for (polkadot / kusama): '
  });
  coin = response_coin.coin;

  const response_start = await prompts({
    type: 'text',
    name: 'start',
    message: 'Enter the start date of your analysis (YYYY-MM-DD). \n Note that for polkadot the earliest possible date is 2020-08-19 and for kusama 2019-09-20:'
  });
  start = response_start.start;

  const response_end = await prompts({
    type: 'text',
    name: 'end',
    message: 'Enter the end date of your analysis (YYYY-MM-DD). \n Note that you might want to use yesterday instead of today in case the price is not logged into the API yet: '
  });
  end = response_end.end;

  date_array = transformArrayToString(makeDaysArray(new Date(start),new Date(end)));

  console.log('\n Please wait for the data to be fetched');

   // CoinGecko API it has 100 requests per minute. If there are more than 100 requests, can I do 100, make the loop wait 1 min and do the rest??
   for(i=0; i<date_array.length; i++){
    let price_call = await CoinGeckoClient.coins.fetchHistory(coin, {
      date: date_array[i] 
    });
    price_array[i] = price_call.data.market_data.current_price.chf;
   }

   dictionary = makePriceDictionary(date_array, price_array);

   console.log(dictionary);
}
main().catch(console.error).finally(() => process.exit());
