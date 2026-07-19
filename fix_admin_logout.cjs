const fs = require('fs');

let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    if (isAuthenticated) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const localSessionId = safeStorage.getItem('adminSessionId');
          if (data.sessionId && localSessionId && data.sessionId !== localSessionId) {
            alert('অন্য কোনো ডিভাইসে অ্যাডমিন লগইন করা হয়েছে। আপনাকে লগআউট করা হচ্ছে।');
            setIsAuthenticated(false);
            safeStorage.removeItem('adminAuth');
            safeStorage.removeItem('adminSessionId');
            safeStorage.removeItem('contributorRole');
            window.location.href = '/';
          }
        }
      });
      return () => unsub();
    }
  }, [isAuthenticated]);
`;

// Insert after `const isSuperAdmin = ...`
const insertPoint = "  const isSuperAdmin = safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'admin';\n";

if (content.includes(insertPoint)) {
  content = content.replace(insertPoint, insertPoint + effectCode);
  fs.writeFileSync('src/Admin.tsx', content, 'utf8');
  console.log('Force logout added to Admin.tsx');
} else {
  console.log('Insert point not found!');
}
