const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `  const [contributorPassword, setContributorPassword] = useState('');`;
const rep1 = `  const [contributorPassword, setContributorPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);`;
code = code.replace(target1, rep1);

const target2 = `          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);`;
const rep2 = `          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);`;
// This target appears twice, in fetchContributorStats and in the onSnapshot, so we replace globally
code = code.split(target2).join(rep2);

const target3 = `        setContributorPassword(data.password || '');`;
const rep3 = `        setContributorPassword(data.password || '');
        setHasPassword(!!data.password);`;
code = code.replace(target3, rep3);

const target4 = `{!contributorPassword && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">`;
const rep4 = `{!hasPassword && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">`;
code = code.replace(target4, rep4);

const target5 = `if (!data.password) {
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইলটি সুরক্ষিত রাখতে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করে নিন।\`);
        }`;
const rep5 = `if (!data.password) {
          alert(\`স্বাগতম \${data.name}! আপনার প্রোফাইলটি সুরক্ষিত রাখতে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করে নিন।\`);
        } else {
          setHasPassword(true);
        }`;
code = code.replace(target5, rep5);

const target6 = `if (contributorPassword) {
        updateData.password = contributorPassword;
      }`;
const rep6 = `if (contributorPassword) {
        updateData.password = contributorPassword;
        setHasPassword(true);
      }`;
code = code.replace(target6, rep6);


fs.writeFileSync(file, code);
console.log("Patched hasPassword!");
