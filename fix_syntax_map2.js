import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// let's just find and replace the block
lines[3530] = ``; // it was `);` in 1-indexed? No. Let's look at it!
fs.writeFileSync('src/App.tsx', lines.join('\n'));
