import CoinGecko from 'coingecko-api';
import util from 'util';
import { transformDDMMYYYtoUnix } from './utils.js';


 export async function addPriceData(obj, sleepTime){
    const sleep = util.promisify(setTimeout);
    const CoinGeckoClient = new CoinGecko();
    let loopindex = -1;

    let i = _setIndex(obj);

    try{
        for(i; i < obj.data.numberOfDays; i++){
            let price_call = await CoinGeckoClient.coins.fetchHistory(obj.network, {
                date: obj.data.list[i].day 
              });
              switch(obj.currency) {
                  case 'CHF':
                      obj.data.list[i].price = price_call.data.market_data.current_price.chf;
                  case 'EUR':
                      obj.data.list[i].price = price_call.data.market_data.current_price.eur;
                  case 'USD':
                      obj.data.list[i].price = price_call.data.market_data.current_price.usd;
                  break;
              }
              loopindex += 1;

            if(loopindex % 100 == 0 & loopindex > 0){
                console.log('We made more than 100 requests to CoinGecko API. Script is paused for ' + sleepTime + ' seconds to reset the request limit. Please wait...');
                await sleep(sleepTime * 1000);
                console.log('Data collection continues...');
                loopindex -= 100;
            }
        }

     } catch (e){
         console.log('Error in parsing CoinGecko Data' + e);
         console.log('If the CoinGecko API throttled your request, try to increase the sleepTime in the config/userInput.json.')
     }
     return obj;
}

function _setIndex(obj){
    var index;

    let network = obj.network;

    if(network == 'polkadot'){
        index = obj.data.list.findIndex(x => transformDDMMYYYtoUnix(x.day) > 1597708800);
    }

    if(network == 'kusama'){
        index = obj.data.list.findIndex(x => transformDDMMYYYtoUnix(x.day) > 1568851200);
    }

    if(index < 0){
        index = 0;
    }

    return index;
}