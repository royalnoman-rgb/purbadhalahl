const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `  const handleMarkContributorMessageAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contributors', id), {
        hasUnreadAdminMessage: false
      });
      setContributors(prev => prev.map(cont => cont.id === id ? { ...cont, hasUnreadAdminMessage: false } : cont));
    } catch (err) {
      console.error(err);
    }
  };`;

const replace = `  const handleMarkContributorMessageAsRead = async (id: string) => {
    try {
      const contributorRef = doc(db, 'contributors', id);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        let updated = false;
        const updatedMessages = messages.map((msg: any) => {
          if (msg.sender === 'user' && !msg.read) {
            updated = true;
            return { ...msg, read: true };
          }
          return msg;
        });
        if (updated) {
          await updateDoc(contributorRef, { messages: updatedMessages, hasUnreadAdminMessage: false });
          fetchData();
        } else {
          await updateDoc(contributorRef, { hasUnreadAdminMessage: false });
          setContributors(prev => prev.map(cont => cont.id === id ? { ...cont, hasUnreadAdminMessage: false } : cont));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };`;

code = code.replace(target, replace);
fs.writeFileSync('src/Admin.tsx', code);
