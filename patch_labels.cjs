const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>',
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার বা ইমেইল *</label>'
);

content = content.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>',
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার বা ইমেইল *</label>'
);

content = content.replace(
  'আপনার মোবাইল নাম্বারটি দিন। আমরা আপনার নাম্বারে একটি ভেরিফিকেশন কোড পাঠাবো।',
  'আপনার মোবাইল নাম্বার বা ইমেইল দিন। আমরা সেখানে একটি ভেরিফিকেশন কোড পাঠাবো।'
);

content = content.replace(
  'আপনার মোবাইল নাম্বার ও পাসওয়ার্ড দিয়ে লগইন করুন।',
  'আপনার মোবাইল নাম্বার বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।'
);

content = content.replace(
  'placeholder="01XXXXXXXXX"',
  'placeholder="মোবাইল বা ইমেইল"'
);
content = content.replace(
  'placeholder="01XXXXXXXXX"',
  'placeholder="মোবাইল বা ইমেইল"'
);

// We should also change type="tel" to type="text" for login inputs so it allows email format
content = content.replace(
  'type="tel" required value={toBengaliDigits(loginPhone)}',
  'type="text" required value={toBengaliDigits(loginPhone)}'
);
content = content.replace(
  'type="tel" required value={toBengaliDigits(loginPhone)}',
  'type="text" required value={toBengaliDigits(loginPhone)}'
);


fs.writeFileSync('src/App.tsx', content);
console.log("Labels replaced");
