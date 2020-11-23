import fs from 'fs';

export function exportVariable(data, name){
    try {
        fs.writeFileSync(name, data);
        console.log("JSON data is saved.");
        } catch (err) {
        console.error(err);
        }
}
