const fs = require('fs');
const path = require('path');
const jsFile = path.join(process.cwd(), 'scripts', 'convertExcelToJson.js');
if (fs.existsSync(jsFile)) {
  let content = fs.readFileSync(jsFile, 'utf8');
  content = content.replace(/__dirname/g, '(process.cwd() + "/scripts")');
  fs.writeFileSync(jsFile, content, 'utf8');
  console.log('Corregido __dirname');
}