import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3533] = `                        </div>`; // close space-y-3
lines[3534] = `                     )}`; // close ternary
lines[3535] = `                  </div>`; // close mb-4
lines[3536] = `                )}`; // close activeUserTab === 'messages' && (

// And wait, what about the .map?
// `))} ` should be before `</div>`
lines[3532] = `                          ))} `;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
