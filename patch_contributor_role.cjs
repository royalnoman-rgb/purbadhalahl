const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Add contributorRole state
appContent = appContent.replace(
  `const [contributorApprovedCount, setContributorApprovedCount] = useState(0);`,
  `const [contributorApprovedCount, setContributorApprovedCount] = useState(0);\n  const [contributorRole, setContributorRole] = useState(safeStorage.getItem('contributorRole') || 'user');`
);

// Update fetchContributorStats
appContent = appContent.replace(
  `setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');`,
  `setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');
          setContributorRole(data.role || 'user');
          safeStorage.setItem('contributorRole', data.role || 'user');`
);

// Update condition for Admin Panel Button
appContent = appContent.replace(
  `{(safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin' || isAdmin) && (`,
  `{(contributorRole === 'moderator' || contributorRole === 'admin' || isAdmin) && (`
);

// Update clear logic when logging out
appContent = appContent.replace(
  `safeStorage.removeItem('contributorPassword');`, // wait this might not exist.
  `safeStorage.removeItem('contributorPassword');`
);

// Let's do the logout logic replace separately.
fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched contributor role state");
