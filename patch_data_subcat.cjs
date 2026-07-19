const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');

const target = `  { categoryId: "education", subCategories: ["স্কুল", "কলেজ", "মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর"] },`;
const replacement = `  { categoryId: "education", subCategories: ["স্কুল", "কলেজ", "মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর ও কোচিং সেন্টার"] },`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/data.ts', code);
  console.log('Fixed predefinedSubCategories in src/data.ts');
} else {
  console.log('Target not found in src/data.ts');
}
