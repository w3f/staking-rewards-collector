import CoinGecko from 'coingecko-api';
import { ceil, round } from 'mathjs';
import { transformDDMMYYYtoUnix } from './utils.js';



export async function addPriceData(obj){
    let priceObject = await _getPriceObject(obj);
    var prices;
    var total_volume;


    prices = _arrayToObject(priceObject.data.prices, "price");
    total_volume = _arrayToObject(priceObject.data.total_volumes, "volume");

    // set index to first day price were available to avoid looking for prices where are none
    let i = _setIndex(obj);

    for(i;i<obj.data.list.length;i++){
        
        let tmp = transformDDMMYYYtoUnix(obj.data.list[i].day);               
        obj.data.list[i].price = round(prices.find(x => x.timestamp == tmp).price,2);
        obj.data.list[i].volume = total_volume.find(x => x.timestamp == tmp).volume;
    }
    return obj;
}

async function _getPriceObject(obj){
    const CoinGeckoClient = new CoinGecko();
    var priceObject;

    let start = transformDDMMYYYtoUnix(obj.data.list[0].day);
    let end = transformDDMMYYYtoUnix(obj.data.list.slice(-1)[0].day);

    // Avoid getting hourly or minute price data.
    end = _checkDuration(start, end);
    
        try{
            priceObject = await CoinGeckoClient.coins.fetchMarketChartRange(obj.network, {
                from: start,
                to: end,
                vs_currency: obj.currency,
            });
        } catch (e){
            console.log('Error in parsing CoinGecko Data' + e);
        }
    return priceObject;
}

/*
CoinGecko API returns a list of arrays without a key,value pair. This function creates an object from that list.
*/

function _arrayToObject(array, key){
    let name = key;
    let obj = [];
    // populate the key
        for(let i=0; i<array.length; i++){
            obj[i] = {
                "timestamp" : array[i][0] / 1000,
                [name]: array[i][1],
            }
        }
    return obj;
}

/*
This function checks if the user did input a time-period larger than 90 days. Minutely data will be provided for for duration within 1 day and  Hourly data will be used for duration between 1 day and 90 days. We are only interested in daily data, so we check if the duration is less than 90 days and then just increase it artificially (only the prices within the time-period of the user will be used later).
*/ 

function _checkDuration(start, end){
    var setEnd;

    let duration = (end - start) / 60 / 60 / 24;

    if(duration < 90){
        setEnd = start + 91 * 60 * 60 * 24;
    } else {
        setEnd = end;
    }
    return setEnd;
}

/*
This function checks when prices were available and sets the index correspondingly to avoid looking for prices when there were none available.
*/

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