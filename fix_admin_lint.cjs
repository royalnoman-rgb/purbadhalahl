const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

code = code.replace(
  "const dCats = catSnap.docs.map(d => ({id: d.id, ...d.data()}));",
  "const dCats = catSnap.docs.map(d => ({id: d.id, ...d.data()} as any));"
);
code = code.replace(
  "const dSubCats = subSnap.docs.map(d => ({id: d.id, ...d.data()}));",
  "const dSubCats = subSnap.docs.map(d => ({id: d.id, ...d.data()} as any));"
);

fs.writeFileSync('src/Admin.tsx', code);
