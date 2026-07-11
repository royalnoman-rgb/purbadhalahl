const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleSendUserMessage = async () => {`;
const replace = `  const handleDeleteContributorMessage = async (msgId: string, deleteForEveryone: boolean) => {
    try {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        const updatedMessages = messages.map((msg: any) => {
          if (msg.id === msgId) {
            if (deleteForEveryone) {
              return { ...msg, deletedForEveryone: true };
            } else {
              return { ...msg, deletedFor: [...(msg.deletedFor || []), 'user'] };
            }
          }
          return msg;
        });
        await updateDoc(contributorRef, { messages: updatedMessages });
        setContributorMessages(updatedMessages);
      }
    } catch(e) {
      console.error(e);
      alert('ম্যাসেজ ডিলেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleSendUserMessage = async () => {`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
