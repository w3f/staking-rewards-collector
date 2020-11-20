import { makePriceArray } from "./api.js";
import { dateToString } from "./utils.js";
import { requestStakingRewards } from './curl.js';

export async function gatherData(start, end, coin, address){
    let obj = {};
    
    let daysArray = [];
    let priceArray = [];

    let startDate = new Date(start);
    let endDate = new Date(end);

    daysArray = makeDaysArray(startDate,endDate);
    priceArray = await makePriceArray(daysArray,coin);

    await requestStakingRewards(daysArray)
    console.log(priceArray);
   
    return '';

    // Create Day Array
 

}

function makeDaysArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    arr = transformArrayToString(arr);
    return arr;
};

function transformArrayToString(array){
  let newArray = [];

  for(let i = 0; i < array.length; i++){
    newArray[i] = dateToString(array[i]);
  }
  return newArray;
}
