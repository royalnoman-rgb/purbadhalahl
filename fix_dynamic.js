import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace('if (dynamicCategoryIds.has(cat.id)) {', 'if (dynamicCategories.some(dc => dc.id === cat.id)) {');
fs.writeFileSync('src/App.tsx', content);
