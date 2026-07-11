const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import ReorderTab from './ReorderTab';")) {
  code = code.replace(
    "import { db, auth, messaging, getToken, onMessage } from './firebase';",
    "import { db, auth, messaging, getToken, onMessage } from './firebase';\nimport ReorderTab from './ReorderTab';"
  );
}

const target = `        {activeTab === 'reorder' && (
          <ReorderTab />
        )}`;

const pos = code.lastIndexOf('</div>\n    </div>\n  );\n}');
if (pos !== -1) {
  code = code.slice(0, pos) + target + "\n      " + code.slice(pos);
}

fs.writeFileSync('src/Admin.tsx', code);
