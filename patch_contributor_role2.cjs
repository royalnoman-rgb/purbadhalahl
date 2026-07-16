const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  `setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');
        }`,
  `setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');
          setContributorRole(data.role || 'user');
          safeStorage.setItem('contributorRole', data.role || 'user');
        }`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched 2");
