const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace(
  "import { getAuth } from 'firebase/auth';",
  "import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';"
);
code += `
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
`;

fs.writeFileSync('src/firebase.ts', code);
