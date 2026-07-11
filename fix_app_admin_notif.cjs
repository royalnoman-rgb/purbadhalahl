const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMsg = `// Notify admin
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: 'admin',
          type: 'user_message',
          title: \`\${contributorName} থেকে ম্যাসেজ\`,
          body: userMessageText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });`;

const replaceMsg = `// Notify admin
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: 'admin',
          type: 'user_message',
          title: \`\${contributorName} থেকে ম্যাসেজ\`,
          body: userMessageText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'inbox'
        });`;

code = code.replace(targetMsg, replaceMsg);
fs.writeFileSync('src/App.tsx', code);
