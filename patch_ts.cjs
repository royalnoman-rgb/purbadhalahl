const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');

content = content.replace(
  'firebaseConfig.firestoreDatabaseId',
  '(firebaseConfig as any).firestoreDatabaseId'
);

fs.writeFileSync('src/firebase.ts', content);
console.log("firebase.ts patched");
