const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });
        await logAdminAction(\`Message sent to contributor: \${contributorData.name || 'Unknown'}\`);`;

const replace = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });

        // Notify user
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: id,
          type: 'admin_message',
          title: 'অ্যাডমিন থেকে নতুন ম্যাসেজ',
          body: contributorMessageText[id].trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });

        await logAdminAction(\`Message sent to contributor: \${contributorData.name || 'Unknown'}\`);`;

code = code.replace(target, replace);
fs.writeFileSync('src/Admin.tsx', code);
