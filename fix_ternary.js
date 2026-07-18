import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3533] = `                    )}`;
lines[3534] = `                  </div>`;
lines[3535] = `                )}`;
lines[3536] = ``;
lines[3537] = ``; // it's duplicate `)}`

fs.writeFileSync('src/App.tsx', lines.join('\n'));
