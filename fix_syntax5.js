import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[3894] = `                    </div>`;
lines[3895] = `                  )}`;
lines[3896] = `                </>`;
lines[3897] = `              )}`;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
