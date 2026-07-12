const fs = require('fs');
let code = fs.readFileSync('src/UserProfileModal.tsx', 'utf8');

if (!code.includes("import { toBengaliDigits")) {
  code = code.replace("import React", "import { toBengaliDigits } from './utils';\nimport React");
}

code = code.replaceAll(`{userPhone}`, `{toBengaliDigits(userPhone)}`);
fs.writeFileSync('src/UserProfileModal.tsx', code);
