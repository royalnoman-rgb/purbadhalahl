const fs = require('fs');
let code = fs.readFileSync('src/UserProfileModal.tsx', 'utf8');

const targetMsg = `await addDoc(collection(db, 'user_messages'), {
        senderPhone: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar,
        receiverPhone: userPhone,
        receiverName: userData?.name || 'Unknown',
        message: messageText.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });`;

const replacementMsg = `await addDoc(collection(db, 'user_messages'), {
        senderPhone: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar,
        receiverPhone: userPhone,
        receiverName: userData?.name || 'Unknown',
        message: messageText.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });

      // Notify receiver
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: userPhone,
        type: 'user_message',
        title: \`\${currentUserName} থেকে ম্যাসেজ\`,
        body: messageText.trim(),
        read: false,
        createdAt: new Date().toISOString(),
        link: 'messages'
      });`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/UserProfileModal.tsx', code);
