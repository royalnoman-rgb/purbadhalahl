const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  '{ categoryId: "education", subCategories: ["স্কুল/কলেজ/মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর"] }',
  '{ categoryId: "education", subCategories: ["স্কুল", "কলেজ", "মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর"] }'
);

fs.writeFileSync('src/data.ts', content);
console.log("data.ts patched");
