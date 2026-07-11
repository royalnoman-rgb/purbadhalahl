const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "setNewCatIcon(category.iconName || 'Building2');",
  "setNewCatIcon(category.iconName || 'Building2');\n    setNewCatColor(category.color || 'bg-emerald-600 text-emerald-50');"
);
fs.writeFileSync('src/App.tsx', code);
