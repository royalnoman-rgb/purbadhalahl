const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace(
  "import { getFirestore } from 'firebase/firestore';",
  "import { getFirestore } from 'firebase/firestore';\nimport { getMessaging, getToken, onMessage } from 'firebase/messaging';"
);
code += `
export let messaging = null;
try {
  messaging = getMessaging(app);
} catch(e) {
  console.log('Firebase messaging not supported', e);
}
export { getToken, onMessage };
`;
fs.writeFileSync('src/firebase.ts', code);
