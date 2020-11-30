import fs from 'fs';

export function exportVariable(data, name){
    try {
        fs.writeFileSync(name, data);
        console.log("Result is exported to " + name + '.');
        } catch (err) {
        console.error(err);
        }
}

export function readJSON(filePath) {
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent);
  }

  export function writeCSV(obj, name){
      const filename = name;

      fs.writeFileSync(filename, extractAsCSV(obj), err => {
          if(err) {
              console.log('Error writing .csv file', err);
          } else {
              console.log('Exported as .csv file');
          }  
      });
  }

  function extractAsCSV(obj){
    const header_list = [
        "Day, Price in " + obj.currency +
        ", Staking Rewards in" + ((obj.network == 'polkadot') ? ' DOT' : ' KSM') + 
        ", Number of Payouts" +
        ", Value in Fiat" +
        ", Income tax (" + (obj.incomeTax*100).toFixed(2) + "%)"
    ];
    
    // remove days without a staking reward.
    for(let i = 0; i < obj.data.list.length; i++){
          if(obj.data.list[i].numberPayouts==0){
              obj.data.list.splice(i,1);
        }
    }    

    const rows_list = obj.data.list.map(entry => {
        if(entry.numberPayouts>0){
          return `${entry.day}, ${entry.price}, ${entry.amountHumanReadable}, ${entry.numberPayouts}, ${entry.valueFiat}, ${entry.valueTaxable}`;
        } 
    });
      return header_list.concat(rows_list).join("\n");
  }