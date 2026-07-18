import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3537] = `                  )} `;
lines[3538] = `                  {activeUserTab === 'contacts' && (`;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
