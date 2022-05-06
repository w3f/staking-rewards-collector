import { addPriceData } from "./api.js";
import { makeDaysArray, initializeObject } from "./utils.js";
import { addStakingData } from './curl.js';

export async function gatherData(
    start, end, network, name, address, currency, priceData, startBalance, ticker, subscan_apikey
) {
   
    let obj = {};
    let daysArray = [];

    daysArray = makeDaysArray(new Date(start), new Date(end));
    obj = initializeObject(daysArray, network, name, address, currency, startBalance, ticker, subscan_apikey);
    if(priceData == 'true'){
        obj = await addPriceData(obj);
    }
    obj = await addStakingData(obj);

    return obj;
}
