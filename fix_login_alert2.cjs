const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "else if (err.code === 'auth/popup-closed-by-user') {",
  "else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {\n        alert('পপআপ ব্লক করা আছে অথবা আপনি লগইন পপআপটি বন্ধ করে দিয়েছেন। দয়া করে ব্রাউজারের পপআপ আনব্লক করুন অথবা নতুন ট্যাবে ওপেন করে চেষ্টা করুন।');\n      } else if (false) {"
);

fs.writeFileSync('src/App.tsx', code);
