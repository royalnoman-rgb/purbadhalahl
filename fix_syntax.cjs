const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => setSelectedCategory\(category\); setSelectedSubCategory\(null\);\}/g, "onClick={() => { setSelectedCategory(category); setSelectedSubCategory(null); }}");

fs.writeFileSync('src/App.tsx', code);
