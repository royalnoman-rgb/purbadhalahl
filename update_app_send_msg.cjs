const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMsg = `await addDoc(collection(db, 'user_messages'), {
        senderPhone: contributorPhone,
        senderName: contributorName,
        senderAvatar: contributorAvatar,
        receiverPhone: selectedUserProfile,
        receiverName: userMessages.find(m => m.senderPhone === selectedUserProfile || m.receiverPhone === selectedUserProfile)?.senderName || 'Unknown',
        message: userMessageText.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });`;

const replacementMsg = `await addDoc(collection(db, 'user_messages'), {
        senderPhone: contributorPhone,
        senderName: contributorName,
        senderAvatar: contributorAvatar,
        receiverPhone: selectedUserProfile,
        receiverName: userMessages.find(m => m.senderPhone === selectedUserProfile || m.receiverPhone === selectedUserProfile)?.senderName || 'Unknown',
        message: userMessageText.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });
      
      // Notify receiver
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: selectedUserProfile,
        type: 'user_message',
        title: \`\${contributorName} থেকে ম্যাসেজ\`,
        body: userMessageText.trim(),
        read: false,
        createdAt: new Date().toISOString(),
        link: 'messages'
      });`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/App.tsx', code);
