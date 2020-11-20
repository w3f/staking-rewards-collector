import fs from 'fs';

export function exportVariable(data){
    try {
        fs.writeFileSync('output.json', data);
        console.log("JSON data is saved.");
        } catch (err) {
        console.error(err);
        }
}
