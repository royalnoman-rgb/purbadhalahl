const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(/ফায়ার সার্ভিস/g, "ফায়ার সার্ভিস");

fs.writeFileSync('src/data.ts', content);
console.log("Patched data.ts");
