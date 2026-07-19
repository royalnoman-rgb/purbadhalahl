const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
`          const snapshot = await getCountFromServer(collection(db, 'contributors'));
          const count = snapshot.data().count;`,
`          const snapshot = await getDocs(collection(db, 'contributors'));
          const count = snapshot.size;`
);
fs.writeFileSync('src/App.tsx', code);
