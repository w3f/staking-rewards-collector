import CoinGecko from 'coingecko-api';
import util from 'util';


 export async function addPriceData(obj){
    const sleep = util.promisify(setTimeout);
    const CoinGeckoClient = new CoinGecko();
    let loopindex = -1;

    try{
        for(let i = 0; i < obj.data.numberOfDays; i++){
            let price_call = await CoinGeckoClient.coins.fetchHistory(obj.network, {
                date: obj.data.list[i].day 
              });
              switch(obj.currency) {
                  case 'chf':
                      obj.data.list[i].price = price_call.data.market_data.current_price.chf;
                  case 'eur':
                      obj.data.list[i].price = price_call.data.market_data.current_price.eur;
                  case 'usd':
                      obj.data.list[i].price = price_call.data.market_data.current_price.usd;
                  break;
              }
              loopindex += 1;

            if(loopindex % 100 == 0 & loopindex > 0){
                console.log('We made more than 100 requests to CoinGecko API. Script is paused for around 80 seconds to reset the request limit. Please wait...');
                await sleep(80000);
                console.log('Data collection continues...');
                loopindex -= 100;
            }
        }

     } catch (e){
         console.log('Error in parsing CoinGecko Data' + e);
     }
     return obj;
}
