const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>',
  '<label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার বা ইমেইল *</label>'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Labels replaced again");
