const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { db } from './firebase';",
  "import { db, auth, googleProvider, facebookProvider } from './firebase';\\nimport { signInWithPopup } from 'firebase/auth';"
);

fs.writeFileSync('src/App.tsx', code);
