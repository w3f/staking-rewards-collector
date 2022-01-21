import fs from 'fs';

export function exportVariable(data, name){
    try {
        fs.writeFileSync(name, data);
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

     try {
         fs.writeFileSync(filename, extractAsCSV(obj));
        } catch (err){
        console.error(err);
        }
    }

  function extractAsCSV(obj){
    const header = [
        "Day, Price in " + obj.currency +
        ", Daily Volume in " + obj.ticker +  
        ", Staking Rewards in" + obj.ticker + 
        ", Number of Payouts" +
        ", Value in Fiat" 
    ]; 
    
    const rows = obj.data.list
        .filter(entry => entry.numberPayouts > 0)
        .map(entry => `${entry.day}, ${entry.price}, ${entry.volume}, ${entry.amountHumanReadable}, ${entry.numberPayouts}, ${entry.valueFiat}`);

      return header.concat(rows).join("\n");
  }