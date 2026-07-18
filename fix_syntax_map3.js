import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3529] = `                            </div>`; // 3530 in 1-based
lines[3530] = ``;
lines[3531] = ``;
lines[3532] = `                          ))} `;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
