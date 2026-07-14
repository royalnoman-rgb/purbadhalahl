const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  /"name": "পূর্বধলা সরকারি কলেজ",\n    "details": "অধ্যক্ষের কার্যালয়",\n    "phone": "01700-444442",\n    "categoryId": "education",\n    "subCategory": "স্কুল"/g,
  '"name": "পূর্বধলা সরকারি কলেজ",\n    "details": "অধ্যক্ষের কার্যালয়",\n    "phone": "01700-444442",\n    "categoryId": "education",\n    "subCategory": "কলেজ"'
);

fs.writeFileSync('src/data.ts', content);
console.log("Fixed college");
