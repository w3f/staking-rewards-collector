 // CoinGecko API it has 100 requests per minute. If there are more than 100 requests, can I do 100, make the loop wait 1 min and do the rest??
 import CoinGecko from 'coingecko-api';


 export async function makePriceArray(daysArray, coin){
    let priceArray = [];
    const CoinGeckoClient = new CoinGecko();
    
    try{
        for(let i=0; i < daysArray.length; i++){
            let price_call = await CoinGeckoClient.coins.fetchHistory(coin, {
              date: daysArray[i] 
            });
            priceArray[i] = price_call.data.market_data.current_price.chf;
        }
     } catch (e){
         console.log('Error in makePriceArray' + e);
     }

     return priceArray;
}
