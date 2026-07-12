const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  "order?: number;",
  "order?: number;\n  subCategoriesOrder?: string[];\n  deletedSubCategories?: string[];"
);
fs.writeFileSync('src/types.ts', code);
