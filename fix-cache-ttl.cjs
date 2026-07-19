const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `if (cached && cacheTime && (now - parseInt(cacheTime)) < 1 * 60 * 1000) { // 30 mins TTL`,
  `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) { // 15 mins TTL`
);

code = code.replace(
  `if (cached && cacheTime && (now - parseInt(cacheTime)) < 1 * 60 * 1000) {
          setTotalUsersCount(parseInt(cached));`,
  `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) {
          setTotalUsersCount(parseInt(cached));`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed cache TTL');
