const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import ReorderTab from './ReorderTab';")) {
  code = code.replace(
    "import { db, auth, messaging, getToken, onMessage } from './firebase';",
    "import { db, auth, messaging, getToken, onMessage } from './firebase';\nimport ReorderTab from './ReorderTab';"
  );
}

const reorderRender = `
        {activeTab === 'reorder' && (
          <ReorderTab />
        )}
`;

code = code.replace(
  /\{activeTab === 'recycle' && \([\s\S]*?\}\)\}/,
  "$&" + reorderRender
);

fs.writeFileSync('src/Admin.tsx', code);
