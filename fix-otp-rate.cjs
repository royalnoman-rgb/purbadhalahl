const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            if (!targetEmail) {
              alert(\`আপনার একাউন্টে কোনো ইমেইল যুক্ত নেই এবং ফোন ভেরিফিকেশন কাজ করছে না। Error: \${e.message}\`);
              return;
            }`;

const replacement = `            if (!targetEmail) {
              alert(\`ফায়ারবেস ফোন ভেরিফিকেশন লিমিট শেষ (Rate exceeded)। ডেভেলপমেন্ট সুবিধার জন্য ডেমো ওটিপি দেওয়া হলো। Error: \${e.message}\`);
              // Proceed to demo OTP below even if email is missing
            }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed OTP rate limit fallback');
} else {
  console.log('Target not found');
}
