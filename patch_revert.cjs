const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<option value="রক্তদাতা (গ্রুপ জানা নেই)">রক্তদাতা (গ্রুপ জানা নেই)</option>',
  '<option value="রক্তদাতা">রক্তদাতা (গ্রুপ জানা নেই)</option>'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Reverted in App.tsx");
