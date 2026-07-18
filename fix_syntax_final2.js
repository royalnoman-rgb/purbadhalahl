import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Set line 3902 (which is index 3901) to empty.
lines[3901] = ``;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
