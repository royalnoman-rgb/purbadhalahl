const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  'subCategories: ["রক্তদাতা", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "ব্লাড ব্যাংক"]',
  'subCategories: ["স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন", "রক্তদাতা", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "ব্লাড ব্যাংক"]'
);

fs.writeFileSync('src/data.ts', content);
console.log("data.ts patched");
