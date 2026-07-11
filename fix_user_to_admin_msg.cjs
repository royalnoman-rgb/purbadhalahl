const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const newMessages = [...(contributorData.messages || []), newMessage];
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadAdminMessage: true
        });`;

const replacement = `const newMessages = [...(contributorData.messages || []), newMessage];
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadAdminMessage: true
        });

        // Notify admin
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: 'admin',
          type: 'user_message',
          title: \`\${contributorName} থেকে ম্যাসেজ\`,
          body: userMessageText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
