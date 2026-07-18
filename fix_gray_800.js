import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/text-gray-800/g, 'text-slate-800');
content = content.replace(/text-gray-300/g, 'text-slate-300');

fs.writeFileSync('src/App.tsx', content);
