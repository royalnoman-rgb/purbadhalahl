const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `          const snapshot = await getDocs(collection(db, 'contributors'));
          const count = snapshot.size;`,
  `          const snapshot = await getCountFromServer(collection(db, 'contributors'));
          const count = snapshot.data().count;`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed user count');
