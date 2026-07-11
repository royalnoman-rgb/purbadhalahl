const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  // Presence setup`;
const replace = `  useEffect(() => {
    if (activeUserTab === 'messages' && contributorPhone) {
      const markAsRead = async () => {
        const unreadMsgs = userMessages.filter(msg => msg.receiverPhone === contributorPhone && !msg.read);
        for (const msg of unreadMsgs) {
          try {
            await updateDoc(doc(db, 'user_messages', msg.id), { read: true });
          } catch(e) {}
        }
      };
      markAsRead();
    }
  }, [activeUserTab, userMessages, contributorPhone]);

  // Presence setup`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
