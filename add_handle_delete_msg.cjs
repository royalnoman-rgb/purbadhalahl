const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleForgotPassword = async (e: React.FormEvent) => {`;
const replace = `  const handleDeleteUserMessage = async (msgId: string, deleteForEveryone: boolean) => {
    try {
      const msgRef = doc(db, 'user_messages', msgId);
      if (deleteForEveryone) {
        await updateDoc(msgRef, { deletedForEveryone: true });
      } else {
        const msgDoc = await getDoc(msgRef);
        if (msgDoc.exists()) {
          const data = msgDoc.data();
          await updateDoc(msgRef, { deletedFor: [...(data.deletedFor || []), contributorPhone] });
        }
      }
    } catch (error) {
      console.error(error);
      alert('ম্যাসেজ ডিলেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
