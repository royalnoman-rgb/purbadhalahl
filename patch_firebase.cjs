const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

const target1 = `import { getFirestore, initializeFirestore } from 'firebase/firestore';`;
const repl1 = `import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';`;

const target2 = `export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, (firebaseConfig as any).firestoreDatabaseId);`;
const repl2 = `export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
  experimentalForceLongPolling: true
}, (firebaseConfig as any).firestoreDatabaseId);`;

if(code.includes(target1)) code = code.replace(target1, repl1);
if(code.includes(target2)) code = code.replace(target2, repl2);

fs.writeFileSync('src/firebase.ts', code);
