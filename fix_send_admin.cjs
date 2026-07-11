const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMsg = `if (contributorDoc.exists()) {
        const contributorData = contributorDoc.data();
        const newMessage = {
          id: Date.now().toString(),
          sender: 'user',
          message: userMessageText.trim(),
          createdAt: new Date().toISOString()
        };
        const newMessages = [...(contributorData.messages || []), newMessage];
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
          link: 'inbox'
        });
        setContributorMessages(newMessages);
        setUserMessageText('');
      }`;

const replaceMsg = `const contributorData = contributorDoc.exists() ? contributorDoc.data() : { messages: [] };
      const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: userMessageText.trim(),
        createdAt: new Date().toISOString()
      };
      const newMessages = [...(contributorData.messages || []), newMessage];
      
      if (contributorDoc.exists()) {
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadAdminMessage: true
        });
      } else {
        await setDoc(contributorRef, {
          name: contributorName,
          phone: contributorPhone,
          facebookUrl: contributorFacebook || '',
          avatar: contributorAvatar || '',
          approvedCount: 0,
          points: 0,
          createdAt: new Date().toISOString(),
          messages: newMessages,
          hasUnreadAdminMessage: true
        });
      }

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: 'admin',
        type: 'user_message',
        title: \`\${contributorName} থেকে ম্যাসেজ\`,
        body: userMessageText.trim(),
        read: false,
        createdAt: new Date().toISOString(),
        link: 'inbox'
      });
      setContributorMessages(newMessages);
      setUserMessageText('');`;

code = code.replace(targetMsg, replaceMsg);
fs.writeFileSync('src/App.tsx', code);
