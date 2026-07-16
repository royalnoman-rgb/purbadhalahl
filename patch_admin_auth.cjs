const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  `const [isAdmin, setIsAdmin] = useState(safeStorage.getItem('adminAuth') === 'true');`,
  `const [isAdmin, setIsAdmin] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin');`
);

appContent = appContent.replace(
  `safeStorage.setItem('contributorName', data.name || '');`,
  `safeStorage.setItem('contributorRole', data.role || 'user');\n        safeStorage.setItem('contributorName', data.name || '');`
);

appContent = appContent.replace(
  `safeStorage.setItem('contributorName', user.displayName || 'Unnamed User');`,
  `safeStorage.setItem('contributorRole', 'user');\n        safeStorage.setItem('contributorName', user.displayName || 'Unnamed User');`
);

fs.writeFileSync('src/App.tsx', appContent);

// Patch Admin.tsx
let adminContent = fs.readFileSync('src/Admin.tsx', 'utf8');
adminContent = adminContent.replace(
  `const [isAuthenticated, setIsAuthenticated] = useState(safeStorage.getItem('adminAuth') === 'true');`,
  `const [isAuthenticated, setIsAuthenticated] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin');`
);

fs.writeFileSync('src/Admin.tsx', adminContent);

console.log("Patched admin auth");
