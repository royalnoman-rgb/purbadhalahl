const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'contributors', 'admin'), {
          lastActive: Date.now()
        }, { merge: true });
      } catch (e) {}
    };`;

const replacement = `    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'contributors', 'admin'), {
          lastActive: Date.now()
        }, { merge: true });
        
        // Also update personal phone presence if logged in
        const phone = safeStorage.getItem('contributorPhone');
        if (phone) {
          await updateDoc(doc(db, 'contributors', phone), {
            lastActive: Date.now()
          }).catch(() => {});
        }
      } catch (e) {}
    };`;

content = content.replace(target, replacement);
fs.writeFileSync('src/Admin.tsx', content);
