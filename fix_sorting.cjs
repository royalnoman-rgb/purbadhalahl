const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const allCategories = [...activeStaticCategories, ...dynamicCategories];",
  "const allCategories = [...activeStaticCategories, ...dynamicCategories].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));"
);

code = code.replace(
  "const allContacts = [...activeStaticContacts, ...activeDynamicContacts];",
  "const allContacts = [...activeStaticContacts, ...activeDynamicContacts].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));"
);

fs.writeFileSync('src/App.tsx', code);
