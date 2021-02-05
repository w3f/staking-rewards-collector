import { addPriceData } from "./api.js";
import { makeDaysArray, initializeObject } from "./utils.js";
import { addStakingData } from './curl.js';

export async function gatherData(start, end, network, address, currency, incomeTax, priceData, initialInvestment){
   
    let obj = {};
    let daysArray = [];

    daysArray = makeDaysArray(new Date(start), new Date(end));
    obj = initializeObject(daysArray, network, address, currency, incomeTax, initialInvestment);
    if(priceData == 'y'){
        obj = await addPriceData(obj);
    }
    obj = await addStakingData(obj);

    return obj;
}
