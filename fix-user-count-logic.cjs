const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) {
          setTotalUsersCount(parseInt(cached) || 0);
        } else {`;

const replacement = `const parsedCached = parseInt(cached);
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000 && !isNaN(parsedCached)) {
          setTotalUsersCount(parsedCached);
        } else {`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed user count logic');
} else {
  console.log('Target not found');
}
