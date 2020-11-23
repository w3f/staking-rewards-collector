import { round } from 'mathjs';

export function dateToString(date){
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

export function makeDaysArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    arr = _transformArrayToString(arr);
    return arr;
};

export function initializeObject(daysArray, network, address, currency, incomeTax){
    let obj = {
        'message': 'empty',
        'address': address,
        'network': network,
        'currency': currency,
        'incomeTax': incomeTax,
        'totalAmountHumanReadable':0,
        'totalAmountFiat': 0,
        'totalTaxBurdenFiat': 0,
        'data':{
            'numberRewardsParsed': 0,
            'numberOfDays': daysArray.length,
            'list':[]
        }
    }
    for(let i = 0; i < daysArray.length; i++){
        obj.data.list[i] = {
            'day' : daysArray[i],
            'blockNumber': '',
            'extrinsicHash': '',
            'price': 0,
            'amountPlanks': 0,
            'numberPayouts':0,
            'amountHumanReadable': 0,
            'valueFiat':0,
            'valueTaxable':0
        }
    }
    return obj;
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

function _transformArrayToString(array){
    let newArray = [];
  
    for(let i = 0; i < array.length; i++){
      newArray[i] = dateToString(array[i]);
    }
    return newArray;
}

export function transformDDMMYYYtoUnix(dateString){

    var dateParts = dateString.split('-');
    let date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    let unix = date.valueOf() / 1000;

    return unix;
}

export function min(a,b){
    var min;
    if(a>b){
        min = b; 
    }else {
        min = a;
    }
    return min;
}

export function calculateMetrics(obj){
    var normalization;
    if(obj.network == 'polkadot'){
        normalization = 1/10000000000;
    } else {
        normalization = 1/1000000000000;
    }
    for(let i = 0; i < obj.data.numberOfDays; i++){
        obj.data.list[i].amountHumanReadable = obj.data.list[i].amountPlanks * normalization;
        obj.data.list[i].valueFiat = obj.data.list[i].amountHumanReadable * obj.data.list[i].price;
        obj.data.list[i].valueTaxable = obj.data.list[i].valueFiat * obj.incomeTax;
        obj.totalAmountFiat = obj.totalAmountFiat + obj.data.list[i].valueFiat;
        obj.totalTaxBurdenFiat =  obj.totalTaxBurdenFiat + obj.data.list[i].valueTaxable;
        obj.totalAmountHumanReadable = obj.totalAmountHumanReadable + obj.data.list[i].amountHumanReadable;
    }

    obj.totalAmountFiat = round(obj.totalAmountFiat,2);
    obj.totalAmountHumanReadable = round(obj.totalAmountHumanReadable,2);
    obj.totalTaxBurdenFiat = round(obj.totalTaxBurdenFiat,2);

    return obj;
}