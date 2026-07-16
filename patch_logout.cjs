const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  `safeStorage.removeItem('contributorFacebook');
                        setContributorName('');`,
  `safeStorage.removeItem('contributorFacebook');
                        safeStorage.removeItem('contributorRole');
                        setContributorRole('user');
                        setContributorName('');`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched logout");
