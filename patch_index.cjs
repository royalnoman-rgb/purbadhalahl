const fs = require('fs');
let content = fs.readFileSync('src/index.tsx', 'utf8');

const patch = `
const originalError = console.error;
console.error = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Quota exceeded')) return;
  if (args.length > 0 && args[0]?.message?.includes('Quota exceeded')) return;
  originalError(...args);
};
`;

if (!content.includes('originalError')) {
  content = patch + content;
  fs.writeFileSync('src/index.tsx', content);
  console.log("Patched index.tsx");
}
