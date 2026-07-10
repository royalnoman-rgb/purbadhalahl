const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      await addDoc(collection(db, 'categories'), {
        title: newCatTitle,
        englishTitle: newCatEnglish,
        iconName: newCatIcon,
        color: newCatColor,
        status: 'pending'
      });`;

const replacement = `      await addDoc(collection(db, 'categories'), {
        title: newCatTitle,
        englishTitle: newCatEnglish,
        iconName: newCatIcon,
        color: newCatColor,
        status: isAdmin ? 'approved' : 'pending'
      });`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
