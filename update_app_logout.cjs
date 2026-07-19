const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    if (isAdmin) {
      const unsub = onSnapshot(doc(db, 'admin_sessions', 'current'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const localSessionId = safeStorage.getItem('adminSessionId');
          if (data.sessionId && data.sessionId !== localSessionId) {
            setIsAdmin(false);
            safeStorage.removeItem('adminAuth');
            safeStorage.removeItem('adminSessionId');
            if (safeStorage.getItem('contributorRole') === 'admin') {
               safeStorage.removeItem('contributorRole');
            }
          }
        }
      });
      return () => unsub();
    }
  }, [isAdmin]);
`;

// Insert after `const [isAdmin, ...`
const insertPoint = "  const [isAdmin, setIsAdmin] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'admin');\n";

if (content.includes(insertPoint)) {
  content = content.replace(insertPoint, insertPoint + effectCode);
  fs.writeFileSync('src/App.tsx', content, 'utf8');
  console.log('Force logout added to App.tsx');
} else {
  console.log('Insert point not found!');
}
