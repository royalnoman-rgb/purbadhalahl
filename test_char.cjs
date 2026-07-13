const fs = require('fs');
const text = fs.readFileSync('src/data.ts', 'utf8');

const matches = text.match(/ফায়ার|ফায়ার/g);
console.log(matches);
