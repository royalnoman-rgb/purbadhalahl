const fs = require('fs');
let code = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

const target = `         if (e.code !== 'unavailable' && !e.message?.includes('offline')) {
             console.error("Error fetching online users", e);
         }`;
const replacement = `         if (e.code !== 'unavailable' && e.code !== 'resource-exhausted' && !e.message?.toLowerCase().includes('quota') && !e.message?.includes('offline')) {
             console.error("Error fetching online users", e);
         }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/VisitorStats.tsx', code);
  console.log('Fixed VisitorStats error logging');
} else {
  console.log('Target not found');
}
