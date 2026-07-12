const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add newSubCategory state
code = code.replace(
  "const [newSubDetails, setNewSubDetails] = useState('');",
  "const [newSubDetails, setNewSubDetails] = useState('');\n  const [newSubCategory, setNewSubCategory] = useState('');"
);

// 2. Add it to payload and updateDoc
code = code.replace(
  "categoryId: newCategory,",
  "categoryId: newCategory,\n        subCategory: newSubCategory,"
);
code = code.replace(
  "categoryId: newCategory,",
  "categoryId: newCategory,\n            subCategory: newSubCategory,"
);

// 3. Clear newSubCategory in the modal opening / reset functions
// We need to look for where `setNewCategory` is called to clear or populate.
