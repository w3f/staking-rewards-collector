import { makePriceArray } from "./api.js";

export async function gatherData(start, end, coin, address){
    let daysArray = [];
    let priceArray = [];

    let startDate = new Date(start);
    let endDate = new Date(end);

    daysArray = makeDaysArray(startDate,endDate);
    priceArray = await makePriceArray(daysArray,coin);
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

function _dateToString(date){
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();

  if(day.length == 1){
    day = day.concat('0');
    day = _reverseString(day);
  }

  if(month.length == 1){
    month = month.concat('0');
    month = _reverseString(month);
  }
  return day.concat('-', month, '-', year);
}

function transformArrayToString(array){
  let newArray = [];

  for(let i = 0; i < array.length; i++){
    newArray[i] = _dateToString(array[i]);
  }
  return newArray;
}

function _reverseString(string){
  var i;
  let length = string.length;
  var tmp_string = '';

  for(i = 0; i < string.length; i++){
    tmp_string = tmp_string.concat(string[length-1]);
    length -= 1;
  }
  return tmp_string;
}