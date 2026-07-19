const fs = require('fs');
let code = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

code = code.replace(/if \(e\.code !== 'unavailable' && !e\.message\?\.includes\('offline'\)\) \{/g, "if (e.code !== 'unavailable' && e.code !== 'resource-exhausted' && !e.message?.toLowerCase().includes('quota') && !e.message?.includes('offline')) {");

fs.writeFileSync('src/components/VisitorStats.tsx', code);
console.log('Fixed all error logging in VisitorStats');
