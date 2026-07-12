const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import { toBengaliDigits")) {
  code = code.replace("import { Trash2", "import { toBengaliDigits, toEnglishDigits } from './utils';\nimport { Trash2");
}

fs.writeFileSync('src/Admin.tsx', code);
