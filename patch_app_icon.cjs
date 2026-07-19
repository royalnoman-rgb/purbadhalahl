const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetIcon = `else if (subCat === 'প্রাইভেট টিউটর') IconComponent = BookOpen;`;
const replacementIcon = `else if (subCat === 'প্রাইভেট টিউটর' || subCat === 'প্রাইভেট টিউটর ও কোচিং সেন্টার') IconComponent = BookOpen;`;

if (code.includes(targetIcon)) {
  code = code.replace(targetIcon, replacementIcon);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed icon mapping in src/App.tsx');
} else {
  console.log('Target not found in src/App.tsx');
}
