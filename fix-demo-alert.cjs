const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "alert(`আপনার ইমেইলে (${targetEmail}) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।\\n(ডেমো কোড: ${otp})`);";
// wait, the previous grep showed the line as:
// alert(`আপনার ইমেইলে (${targetEmail}) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।\n(ডেমো কোড: ${otp})`);
// actually, let's just replace the exact line using a regex.
code = code.replace(/alert\(`আপনার ইমেইলে \(\${targetEmail}\) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।\\n\(ডেমো কোড: \${otp}\)`\);/, `if (targetEmail) { alert(\`আপনার ইমেইলে (\${targetEmail}) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।\\n(ডেমো কোড: \${otp})\`); } else { alert(\`(ডেমো কোড: \${otp})\`); }`);

// try a more generic replace if there's no \n
code = code.replace(/alert\(`আপনার ইমেইলে \(\${targetEmail}\) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।\(ডেমো কোড: \${otp}\)`\);/, `if (targetEmail) { alert(\`আপনার ইমেইলে (\${targetEmail}) একটি ভেরিফিকেশন কোড পাঠানো হয়েছে। (ডেমো কোড: \${otp})\`); } else { alert(\`(ডেমো কোড: \${otp})\`); }`);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed demo alert');
