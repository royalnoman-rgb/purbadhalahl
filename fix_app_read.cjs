const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleMarkMessagesAsRead = async () => {
    if (!contributorPhone) return;
    try {
      await updateDoc(doc(db, 'contributors', contributorPhone), {
        hasUnreadMessage: false
      });
      setHasUnreadMessages(false);
    } catch (err) { console.error(err); }
  };`;

const replace = `  const handleMarkMessagesAsRead = async () => {
    if (!contributorPhone) return;
    try {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        let updated = false;
        const updatedMessages = messages.map((msg: any) => {
          if (msg.sender === 'admin' && !msg.read) {
            updated = true;
            return { ...msg, read: true };
          }
          return msg;
        });
        if (updated) {
          await updateDoc(contributorRef, { messages: updatedMessages, hasUnreadMessage: false });
          setContributorMessages(updatedMessages);
        } else {
          await updateDoc(contributorRef, { hasUnreadMessage: false });
        }
      }
      setHasUnreadMessages(false);
    } catch (err) { console.error(err); }
  };`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
