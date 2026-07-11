const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetMsg = `await updateDoc(feedbackRef, {
          replies: newReplies,
          hasUnreadAdminReply: false,
          hasUnreadUserReply: true
        });`;

const replacementMsg = `await updateDoc(feedbackRef, {
          replies: newReplies,
          hasUnreadAdminReply: false,
          hasUnreadUserReply: true
        });

        // Notify user
        if (feedback.contributorPhone) {
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: feedback.contributorPhone,
            type: 'admin_reply',
            title: 'অ্যাডমিন আপনার মতামতে রিপ্লাই করেছেন',
            body: replyText[feedbackId].trim(),
            read: false,
            createdAt: new Date().toISOString(),
            link: 'feedbacks'
          });
        }`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/Admin.tsx', code);
