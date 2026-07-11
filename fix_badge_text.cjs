const fs = require('fs');
const files = ['src/App.tsx', 'src/Admin.tsx', 'src/Community.tsx'];
const oldText = "এই ভেরিফাইড ব্যাজটি নির্দেশ করে যে ব্যবহারকারীর পরিচয় যাচাইকৃত এবং তিনি আমাদের প্ল্যাটফর্মের একজন বিশ্বস্ত কন্ট্রিবিউটর বা সম্মানিত ব্যক্তি।";
const newText = "This verified badge indicates that the user's identity has been verified and they are a trusted contributor to our platform.";

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.split(oldText).join(newText);
    fs.writeFileSync(file, code);
  }
});
console.log("Tooltip text updated.");
