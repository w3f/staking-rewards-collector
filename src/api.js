 // CoinGecko API it has 100 requests per minute. If there are more than 100 requests, can I do 100, make the loop wait 1 min and do the rest??
 import CoinGecko from 'coingecko-api';


 export async function addPriceData(obj){
    const CoinGeckoClient = new CoinGecko();

    try{
        for(let i=0; i < obj.data.numberOfDays; i++){
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
        }
     } catch (e){
         console.log('Error in parsing CoinGecko Data' + e);
     }
     return obj;
}
