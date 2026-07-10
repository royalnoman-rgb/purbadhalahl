const fs = require('fs');

const replacement = `const VerifiedBadge = () => (
  <BadgeCheck className="w-[16px] h-[16px] text-[#0866FF] fill-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5" stroke="white" strokeWidth={2.5} title="Verified Contributor" />
);`;

['src/App.tsx', 'src/Community.tsx', 'src/Admin.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    const badgeRegex = /const VerifiedBadge = \(\) => \([\s\S]*?<\/svg>\n\);/;
    if (badgeRegex.test(code)) {
      code = code.replace(badgeRegex, replacement);
      
      // Ensure BadgeCheck is imported if replacing
      if (!code.includes('BadgeCheck')) {
        const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
        code = code.replace(importRegex, "import { BadgeCheck, $1 } from 'lucide-react';");
      }

      fs.writeFileSync(file, code);
      console.log(`Replaced in ${file}`);
    } else {
      console.log(`Not found in ${file}`);
    }
  }
});
