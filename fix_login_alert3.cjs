const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {",
  "else if (err.code === 'auth/operation-not-allowed') {\n        alert('Google বা Facebook লগইন Firebase-এ চালু নেই। ದয়া করে Firebase Console > Authentication > Sign-in method-এ গিয়ে এটি চালু করুন।');\n      } else if (err.code === 'auth/cancelled-popup-request') {\n        // Ignore cancelled popup request\n      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {"
);

fs.writeFileSync('src/App.tsx', code);
