const { ApiPromise, WsProvider } = require('@polkadot/api');
const CoinGecko = require('coingecko-api');
const moment = require('moment');


const CoinGeckoClient = new CoinGecko();

const ADDR = '15wqXZqwCkkpHox8u1a5D8oHw3t57pDP7SK1YHQbPGrXrhaj';
const YEAR = '2020'

start = YEAR.concat('-01-01');
end = YEAR.concat('-12-31');

var getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

var daylist = getDaysArray(new Date(start),new Date(end));
daylist.map((v)=>v.toISOString().slice(0,10)).join("")

console.log(daylist);



async function main () {

   // CoinGecko API
    let polkadot = await CoinGeckoClient.coins.fetchHistory('polkadot', {
        date: '30-09-2020'
      });
    console.log(polkadot.data.market_data.current_price.chf);



    // Polkadot API

  // Initialise the provider to connect to the local node
  const provider = new WsProvider('wss://rpc.polkadot.io');

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  // Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & nonce via the system module
const { nonce, data: balance } = await api.query.system.account(ADDR);

console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

}

main().catch(console.error).finally(() => process.exit());
