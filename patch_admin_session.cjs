const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const targetApp = `  useEffect(() => {
    if (isAdmin) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {`;
const replApp = `  useEffect(() => {
    const isGlobalAdmin = safeStorage.getItem('adminAuth') === 'true' && !safeStorage.getItem('contributorRole');
    if (isAdmin && isGlobalAdmin) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {`;
if(appCode.includes(targetApp)) {
  fs.writeFileSync('src/App.tsx', appCode.replace(targetApp, replApp));
  console.log('Patched App.tsx');
} else {
  console.log('Failed to patch App.tsx');
}

// Patch Admin.tsx
let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');
const targetAdmin = `  useEffect(() => {
    if (isAuthenticated) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {`;
const replAdmin = `  useEffect(() => {
    const isGlobalAdmin = safeStorage.getItem('adminAuth') === 'true' && !safeStorage.getItem('contributorRole');
    if (isAuthenticated && isGlobalAdmin) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {`;
if(adminCode.includes(targetAdmin)) {
  fs.writeFileSync('src/Admin.tsx', adminCode.replace(targetAdmin, replAdmin));
  console.log('Patched Admin.tsx');
} else {
  console.log('Failed to patch Admin.tsx');
}
