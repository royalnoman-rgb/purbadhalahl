const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { VisitorStats }')) {
  // Let's just prepend it to the top after the first import
  code = code.replace(
    "import React,",
    "import { VisitorStats } from './components/VisitorStats';\nimport React,"
  );
  fs.writeFileSync('src/App.tsx', code);
}
