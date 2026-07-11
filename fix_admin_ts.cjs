const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

// Fix notifications map
code = code.replace(
  "const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));",
  "const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));"
);
// Wait, if it's already "as any", why the error?
