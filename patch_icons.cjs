const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "else if (subCat === 'স্কুল/কলেজ/মাদ্রাসা') IconComponent = School;",
  "else if (subCat === 'স্কুল' || subCat === 'কলেজ' || subCat === 'মাদ্রাসা') IconComponent = School;"
);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx icons patched");
