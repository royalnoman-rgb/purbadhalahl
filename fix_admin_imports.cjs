const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');
if (!code.includes("import { toBengaliDigits")) {
  code = "import { toBengaliDigits, toEnglishDigits } from './utils';\n" + code;
}
fs.writeFileSync('src/Admin.tsx', code);
