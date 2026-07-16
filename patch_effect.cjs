const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove isContributorProfileOpen from the condition
content = content.replace(
  `if (isContributorProfileOpen && contributorPhone && isSavedSession && contributorPhone === savedPhone) {`,
  `if (contributorPhone && isSavedSession && contributorPhone === savedPhone) {`
);

// 2. Remove isContributorProfileOpen from the dependency array
content = content.replace(
  `}, [isContributorProfileOpen, contributorPhone]);`,
  `}, [contributorPhone]);`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched useEffect");
