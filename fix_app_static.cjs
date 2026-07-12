const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id));",
  "const dynamicContactIds = new Set(dynamicContacts.map(c => c.id));\n  const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id) && !dynamicContactIds.has(c.id));"
);

fs.writeFileSync('src/App.tsx', code);
