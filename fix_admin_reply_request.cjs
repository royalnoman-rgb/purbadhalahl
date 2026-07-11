const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });`;

const replacement = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });

        // Notify user
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: contributorPhone,
          type: 'admin_message',
          title: 'অ্যাডমিনের থেকে ম্যাসেজ',
          body: requestReplyText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/Admin.tsx', code);
