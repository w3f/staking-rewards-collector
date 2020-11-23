import prompts from 'prompts';

export async function getUserInput(){

    var address;
    var coin;
    var start;
    var end;
    var currency;
    var incomeTax;


  console.log('-------------------------------------------- WELCOME ----------------------------------------------\n');
  console.log('I do not take any responsibility for the correctness of the results, do your own research!!');
  console.log('This tool should help you to request your staking rewards for a given address and calculate your tax burden.');
  console.log('It will be possible for you to insert your Address and the time-frame for which the staking rewards should be calculated.');
  console.log('The daily prices are requested from the CoinGecko API and the staking rewards from Polkastats GraphQL.\n');


  const response_address = await prompts({
    type: 'text',
    name: 'address',
    message: 'Please enter the address you want to look up the staking rewards for (ctrl+shift+v): '
  });
  address = response_address.address;

  const response_network = await prompts({
    type: 'text',
    name: 'network',
    message: 'Enter the network you want to get the rewards for (polkadot / kusama): '
  });
  network = response_network.network;

  const response_start = await prompts({
    type: 'text',
    name: 'start',
    message: 'Enter the start date of your analysis (YYYY-MM-DD). Note that for polkadot the earliest possible date is 2020-08-19 and for kusama 2019-09-20:'
  });
  start = response_start.start;

  const response_end = await prompts({
    type: 'text',
    name: 'end',
    message: 'Enter the end date of your analysis (YYYY-MM-DD). Note that you might want to use yesterday instead of today in case the price is not logged into the API yet: '
  });
  end = response_end.end;

  const response_currency = await prompts({
    type: 'text',
    name: 'currency',
    message: 'Which fiat-currency you want to parse daily data (chf, usd, eur)'
  });
  currency = response_currency.currency;

  const response_tax = await prompts({
    type: 'text',
    name: 'incomeTax',
    message: 'If you want, you can directly state your income tax rate to estimate your tax burden. If you do not want that, type 0'
  });
  incomeTax = response_tax.incomeTax;

  return {
      'address': address, 
      'network': network, 
      'start': start, 
      'end': end, 
      'currency': currency, 
      'incomeTax': incomeTax
    };
}

// start and end as YYYY-MM-DD
export function MockUserInput(){
    let userInput = {};

    userInput = {
        'address': '15fTw39Ju2jJiHeGe1fJ5DtgugUauy9tr2HZuiRNFwqnGQ1Q',
        'network': 'polkadot',
        'start': '2020-10-10',
        'end': '2020-11-23',
        'currency': "chf",
        'incomeTax': 0.07,
    };

    return userInput;
}