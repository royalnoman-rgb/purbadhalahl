import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[4041] = `    </div>`;
lines[4042] = `    </>`;
lines[4043] = `  );`;
lines[4044] = `}`;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
