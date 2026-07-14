const fs = require('fs');
let content = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

content = content.replace('const intervalId = setInterval(updatePresence, 60000); // update every minute', 'const intervalId = setInterval(updatePresence, 120000); // update every 2 minutes');
content = content.replace('const threshold = Date.now() - 3 * 60000; // 3 minutes', 'const threshold = Date.now() - 5 * 60000; // 5 minutes');
content = content.replace('const countIntervalId = setInterval(fetchOnlineCount, 30000);', 'const countIntervalId = setInterval(fetchOnlineCount, 300000); // every 5 mins');

fs.writeFileSync('src/components/VisitorStats.tsx', content);
console.log("Visitor stats patched");
