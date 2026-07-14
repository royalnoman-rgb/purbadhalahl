const fs = require('fs');
let content = fs.readFileSync('src/index.tsx', 'utf8');

const globalPatch = `
window.addEventListener('error', (e) => {
  if (e.message?.includes('Quota exceeded') || e.error?.message?.includes('Quota exceeded')) {
    e.preventDefault();
  }
});
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('Quota exceeded') || (typeof e.reason === 'string' && e.reason.includes('Quota exceeded'))) {
    e.preventDefault();
  }
});
`;

if (!content.includes('unhandledrejection')) {
  content = content.replace('originalWarn(...args);\n};', 'originalWarn(...args);\n};\n' + globalPatch);
  fs.writeFileSync('src/index.tsx', content);
  console.log("Patched index.tsx with global error handlers");
}
