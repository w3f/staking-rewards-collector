import CoinGecko from 'coingecko-api';
import { ceil, round } from 'mathjs';
import util from 'util';
import { transformDDMMYYYtoUnix } from './utils.js';


 export async function addPriceData(obj, sleepTime){
    const sleep = util.promisify(setTimeout);
    const maxRequests = 60;
    const CoinGeckoClient = new CoinGecko();
    let loopindex = -1;

    let i = _setIndex(obj);
    let requestsLeft = obj.data.numberOfDays - i;

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

            if(loopindex % maxRequests == 0 & loopindex > 0){
                console.log(

                    'We made ' + maxRequests + ' requests to the CoinGecko API. Script is paused for ' + sleepTime + ' seconds. ' + 
                    'There are ' + requestsLeft + ' requests left. ' +
                    'This will take approx. ' + 
                    round(ceil(requestsLeft / maxRequests) * (sleepTime + 10) / 60,1) + 
                    ' more minutes.'
                    );
                await sleep(sleepTime * 1000);
                console.log('Data collection continues...');
                loopindex -= maxRequests;
                requestsLeft -= maxRequests;
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