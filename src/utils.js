import { round, pow } from 'mathjs';

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

export function makeDaysArray(startDate, endDate) {
    let dates = [];
    const theDate = new Date(startDate);
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates = [...dates, endDate];
    dates = _transformArrayToString(dates);
    return dates;
  };

export function initializeObject(daysArray, network, address, currency, incomeTax, initialInvestment){
    let obj = {
        'message': 'empty',
        'address': address,
        'network': network,
        'currency': currency,
        'incomeTax': incomeTax,
        'initialInvestment': initialInvestment,
        'firstReward': '',
        'lastReward': '',
        'annualizedReturn':0,
        'currentValueRewardsFiat':0,
        'totalAmountHumanReadable':0,
        'totalValueFiat': 0,
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
        // generate new metrics and round
        obj.data.list[i].amountHumanReadable = round(obj.data.list[i].amountPlanks * normalization,4);
        obj.data.list[i].valueFiat = round(obj.data.list[i].amountHumanReadable * obj.data.list[i].price,2);
        obj.data.list[i].valueTaxable = round(obj.data.list[i].valueFiat * obj.incomeTax,2);
        obj.data.list[i].price = round(obj.data.list[i].price,2);

        // add values of each day to general metrics.
        obj.totalValueFiat = obj.totalValueFiat + obj.data.list[i].valueFiat;
        obj.totalTaxBurdenFiat =  obj.totalTaxBurdenFiat + obj.data.list[i].valueTaxable;
        obj.totalAmountHumanReadable = obj.totalAmountHumanReadable + obj.data.list[i].amountHumanReadable;
    }

    obj.totalValueFiat = round(obj.totalValueFiat,2);
    obj.totalAmountHumanReadable = round(obj.totalAmountHumanReadable,2);
    obj.totalTaxBurdenFiat = round(obj.totalTaxBurdenFiat,2);
    obj.currentValueRewardsFiat = round(obj.totalAmountHumanReadable * obj.data.list[0].price,2);
    obj.annualizedReturn = _calculateAnnualizedReturn(obj);
    
    return obj;
}

function _calculateAnnualizedReturn(obj){
    var annualized;
    var firstAndLastReward;
    var daysBetweenRewards;

    firstAndLastReward = _getFirstandLastReward(obj);
    obj.firstReward = firstAndLastReward.firstReward;
    obj.lastReward = firstAndLastReward.lastReward;
    //added one day because users must lock for one day and wait.
    daysBetweenRewards =  ((transformDDMMYYYtoUnix(obj.lastReward) - transformDDMMYYYtoUnix(obj.firstReward)) / 60 / 60 / 24) + 1;
    let rateOfReturn = 1 + obj.totalAmountHumanReadable /obj.initialInvestment;
    let daysFraction = 365 / daysBetweenRewards;
    annualized = pow(rateOfReturn,daysFraction) - 1;

    return annualized;
}

function _getFirstandLastReward(obj){
    let i = 0;
    let max = obj.data.numberOfDays;
    let x = max - 1;
    var firstReward;
    var lastReward;

    while (i < max) {
        if (obj.data.list[i].numberPayouts != 0) {
            firstReward = obj.data.list[i].day; 
            break;
        } 
        i++;
    }

    while (x >= 0) {
        if (obj.data.list[x].numberPayouts != 0) {    
           lastReward = obj.data.list[x].day;
            break;
        }
        x--;
    }
    return {
        'firstReward': firstReward,
        'lastReward': lastReward
    }
}

export function verifyUserInput(userInput){
    let start = new Date(userInput.start);
    let end = new Date(userInput.end);
    let network = userInput.network;
    let priceData = userInput.priceData;

    if(start > end){
        throw new Error('Start date must be before end date')
    }

    if(end > new Date()){
        throw new Error('Start date is in the future.');
    }

    if(end.valueOf() < 1597708800000 & network == 'polkadot' & priceData == 'y'){
        userInput.priceData = 'n';
        console.log('Your requested time window lies before prices are available. Switching off price data.');    
    }
    
    if(end.valueOf() < 1568851200000 & network == 'kusama' & priceData == 'y'){
        userInput.priceData = 'n';
        console.log('Your requested time window lies before prices are available. Switching off price data.');
    }
    return userInput;
}