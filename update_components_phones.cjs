const fs = require('fs');
let code = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');

if (!code.includes("import { toBengaliDigits, toEnglishDigits }")) {
  code = code.replace("import React", "import { toBengaliDigits, toEnglishDigits } from '../utils';\nimport React");
}

code = code.replaceAll(`{c.phone}`, `{toBengaliDigits(c.phone)}`);

fs.writeFileSync('src/components/DataManagementTab.tsx', code);
