const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// We want isAdmin to only be for true admins so they can see notifications, edit directly, delete directly.
appContent = appContent.replace(
  `const [isAdmin, setIsAdmin] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin');`,
  `const [isAdmin, setIsAdmin] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'admin');`
);

fs.writeFileSync('src/App.tsx', appContent);

console.log("Patched app roles");
