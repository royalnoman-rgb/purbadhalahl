import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3536] = `                  </div>`; // closes 3457
lines[3537] = `                  </div>`; // closes 3357
lines[3538] = `                )}`; // closes 3356
// 3539 is {activeUserTab === 'contacts' && (

fs.writeFileSync('src/App.tsx', lines.join('\n'));
