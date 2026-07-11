const fs = require('fs');
const code = fs.readFileSync('src/Admin.tsx', 'utf8');
const match = code.match(/\{activeTab === 'recycle' && \([\s\S]*?\}\)\}/);
console.log(match ? "Found recycle tab" : "Not found");
