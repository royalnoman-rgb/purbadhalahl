import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

lines[4036] = `            </div>`;
lines[4037] = `          </div>`;
lines[4038] = `        </div>`;
lines[4039] = `      )}`;
lines[4040] = ``;
lines[4041] = `    </div>`;
lines[4042] = `  );`;
lines[4043] = `}`;
lines[4044] = ``;
lines[4045] = ``;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
