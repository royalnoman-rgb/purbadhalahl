const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `               else if (subCat === 'প্রাইভেট টিউটর' || subCat === 'প্রাইভেট টিউটর ও কোচিং সেন্টার') IconComponent = BookOpen;`;
const replacement = `               else if (subCat === 'প্রাইভেট টিউটর' || subCat === 'প্রাইভেট টিউটর ও কোচিং সেন্টার') IconComponent = BookOpen;
               else if (subCat === 'শিক্ষক') IconComponent = GraduationCap;`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Added teacher icon');
} else {
  console.log('Target not found in src/App.tsx');
}
