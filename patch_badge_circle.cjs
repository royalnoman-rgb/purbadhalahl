const fs = require('fs');

const replacement = `const VerifiedBadge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] text-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Verified Contributor"
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" />
  </svg>
);`;

['src/App.tsx', 'src/Community.tsx', 'src/Admin.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    const badgeRegex = /const VerifiedBadge = \(\) => \([\s\S]*?\);/;
    if (badgeRegex.test(code)) {
      code = code.replace(badgeRegex, replacement);
      fs.writeFileSync(file, code);
      console.log(`Replaced in ${file}`);
    } else {
      console.log(`Not found in ${file}`);
    }
  }
});
