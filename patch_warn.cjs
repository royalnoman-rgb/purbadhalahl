const fs = require('fs');
let content = fs.readFileSync('src/index.tsx', 'utf8');

const warnPatch = `
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Quota exceeded')) return;
  if (args.length > 0 && args[0]?.message?.includes('Quota exceeded')) return;
  originalWarn(...args);
};
`;

if (!content.includes('originalWarn')) {
  // insert after originalError patch
  content = content.replace('originalError(...args);\n};', 'originalError(...args);\n};\n' + warnPatch);
  fs.writeFileSync('src/index.tsx', content);
  console.log("Patched index.tsx with warn");
}
