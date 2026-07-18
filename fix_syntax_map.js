import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3531] = ``;
lines[3532] = `                          ))} `;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
