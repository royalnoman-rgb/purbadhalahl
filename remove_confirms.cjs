const fs = require('fs');

function removeConfirm(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace: if(window.confirm('...')) { ... }
  // Since some are multi-line, it's tricky with regex.
  code = code.replace(/if\s*\(\s*window\.confirm\([^)]+\)\s*\)\s*\{([\s\S]*?)\}/g, (match, inner) => {
    return inner.trim();
  });
  
  fs.writeFileSync(file, code);
}

removeConfirm('src/Admin.tsx');
removeConfirm('src/App.tsx');
removeConfirm('src/Community.tsx');
