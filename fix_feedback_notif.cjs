const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `status: 'pending'
      });
      
      setRequestStatus('success');`;

const replacement = `status: 'pending'
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: 'admin',
        type: 'feedback',
        title: 'নতুন মতামত/আইডিয়া',
        body: \`\${contributorName || newFeedbackName}: \${newFeedbackMessage}\`,
        read: false,
        createdAt: new Date().toISOString(),
        link: 'feedbacks'
      });
      
      setRequestStatus('success');`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
