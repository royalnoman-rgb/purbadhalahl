const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { ConfirmDialog }")) {
  code = code.replace("import Community from './Community';", "import Community from './Community';\nimport { ConfirmDialog } from './components/ConfirmDialog';");
  fs.writeFileSync('src/App.tsx', code);
}
