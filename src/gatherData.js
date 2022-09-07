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
    obj = await addStakingData(obj);
    // There's no point in hitting the CoinGecko API if there are not any rewards.
    if (priceData == 'true' && obj.data.numberRewardsParsed > 0) {
        obj = await addPriceData(obj);
    }

    return obj;
}
