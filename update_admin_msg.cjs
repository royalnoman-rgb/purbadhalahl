const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetMsg = `await updateDoc(contributorRef, {
          messages: updatedMessages,
          hasUnreadMessage: true
        });`;

const replacementMsg = `await updateDoc(contributorRef, {
          messages: updatedMessages,
          hasUnreadMessage: true
        });

        // Notify user
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: contributorId,
          type: 'admin_message',
          title: 'অ্যাডমিনের থেকে ম্যাসেজ',
          body: adminMessageText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/Admin.tsx', code);
