const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `        if (!data.password) {
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইলটি সুরক্ষিত রাখতে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করে নিন।\`);
        } else {
          setHasPassword(true);
        localStorage.setItem('hasPassword', 'true');
        } else {
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইল সফলভাবে লগইন হয়েছে।\`);
        }`;
const rep = `        if (!data.password) {
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইলটি সুরক্ষিত রাখতে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করে নিন।\`);
        } else {
          setHasPassword(true);
          localStorage.setItem('hasPassword', 'true');
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইল সফলভাবে লগইন হয়েছে।\`);
        }`;
code = code.replace(target, rep);

fs.writeFileSync(file, code);
