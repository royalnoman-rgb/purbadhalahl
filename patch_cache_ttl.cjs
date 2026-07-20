const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCache = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) { // 7 days TTL`;
const targetCache2 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000 && !isNaN(parsedCached)) {`;
const targetCacheInit = `if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) {`;

const replacementCache = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) { // 15 minutes TTL`;
const replacementCache2 = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000 && !isNaN(parsedCached)) {`;
const replacementCacheInit = `if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 15 * 60 * 1000) {`;

if (code.includes(targetCache)) {
  code = code.replace(targetCache, replacementCache);
  code = code.replace(targetCache2, replacementCache2);
  code = code.replace(targetCacheInit, replacementCacheInit);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully updated cache TTL to 15 minutes');
} else {
  console.log('Failed to find cache TTL targets');
}
