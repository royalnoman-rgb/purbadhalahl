const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) { // 15 minutes TTL`;
const repl1 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) { // 24 hours TTL`;

const target2 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000 && !isNaN(parsedCached)) {`;
const repl2 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000 && !isNaN(parsedCached)) {`;

appCode = appCode.replace(target1, repl1);
appCode = appCode.replace(target2, repl2);

fs.writeFileSync('src/App.tsx', appCode);
console.log('Cache patched to 24 hours');
