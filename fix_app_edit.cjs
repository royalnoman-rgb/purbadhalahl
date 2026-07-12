const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "await updateDoc(doc(db, 'contacts', editingContactId), {",
  "await setDoc(doc(db, 'contacts', editingContactId), {"
);

code = code.replace(
  "subCategory: newSubCategory,\n          });",
  "subCategory: newSubCategory,\n          }, { merge: true });"
);

fs.writeFileSync('src/App.tsx', code);
