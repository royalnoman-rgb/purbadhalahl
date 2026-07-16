const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  `safeStorage.setItem('contributorName', data.name || '');
        safeStorage.setItem('contributorPhone', actualPhoneId);`,
  `safeStorage.setItem('contributorRole', data.role || 'user');
        setContributorRole(data.role || 'user');
        safeStorage.setItem('contributorName', data.name || '');
        safeStorage.setItem('contributorPhone', actualPhoneId);`
);
fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched handleLogin");
