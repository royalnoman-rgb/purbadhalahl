const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import { categories as staticCategories, contacts as staticContacts }")) {
  code = code.replace(
    "import { db, auth, messaging, getToken, onMessage } from './firebase';",
    "import { db, auth, messaging, getToken, onMessage } from './firebase';\nimport { categories as staticCategories, contacts as staticContacts } from './data';"
  );
}

fs.writeFileSync('src/Admin.tsx', code);
