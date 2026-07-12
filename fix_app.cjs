const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const orderMap = new Map((selectedCategory.subCategoriesOrder || []).map((name, i) => [name, i]));",
  "const orderMap = new Map<string, number>((selectedCategory.subCategoriesOrder || []).map((name, i) => [name, i]));"
);

fs.writeFileSync('src/App.tsx', code);
