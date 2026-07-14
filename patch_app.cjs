const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `    useEffect(() => {
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
  }, [activeUserTab, userMessages, contributorPhone]);`,
  `  const attemptedMarkRead = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (activeUserTab === 'messages' && contributorPhone) {
      const markAsRead = async () => {
        const unreadMsgs = userMessages.filter(msg => msg.receiverPhone === contributorPhone && !msg.read && !attemptedMarkRead.current.has(msg.id));
        for (const msg of unreadMsgs) {
          attemptedMarkRead.current.add(msg.id);
          try {
            await updateDoc(doc(db, 'user_messages', msg.id), { read: true });
          } catch(e) {
            console.error("markAsRead error", e);
          }
        }
      };
      markAsRead();
    }
  }, [activeUserTab, userMessages, contributorPhone]);`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx for loop");
