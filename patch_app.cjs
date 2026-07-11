const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { ConfirmDialog } from './components/ConfirmDialog';",
  "import { ConfirmDialog } from './components/ConfirmDialog';\nimport { InstallPrompt } from './components/InstallPrompt';"
);

// Add to the main return block. Let's find a good place.
const returnTarget = `<div className="min-h-screen bg-gray-50 flex flex-col font-sans">`;
const returnReplace = `<div className="min-h-screen bg-gray-50 flex flex-col font-sans">\n      <InstallPrompt />`;

code = code.replace(returnTarget, returnReplace);

fs.writeFileSync('src/App.tsx', code);
