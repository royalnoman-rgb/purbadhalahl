const fs = require('fs');
let code = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

const target = `        const randomOffset = Math.floor(Math.random() * 3);
        const displayCount = active > 1 ? active + randomOffset : (Math.random() > 0.5 ? 2 : 1);`;

const replacement = `        const displayCount = active + 7;`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/VisitorStats.tsx', code);
  console.log('Fixed online user count logic');
} else {
  console.log('Target not found in VisitorStats');
}
