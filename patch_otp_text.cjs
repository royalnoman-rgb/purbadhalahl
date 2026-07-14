const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'আপনার মোবাইল নাম্বারে পাঠানো ৪-ডিজিটের কোডটি এখানে লিখুন।',
  'আপনার মোবাইল বা ইমেইলে পাঠানো ৪-ডিজিটের কোডটি এখানে লিখুন। (ডেমো হিসেবে পপআপে দেখানো কোডটি ব্যবহার করুন)'
);

fs.writeFileSync('src/App.tsx', content);
console.log("OTP Text replaced");
