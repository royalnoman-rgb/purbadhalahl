const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `authorAvatar: contributorAvatar || ''
      });
      
      setReviewSubmitStatus('success');`;

const replacement = `authorAvatar: contributorAvatar || ''
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: 'admin',
        type: 'review',
        title: 'নতুন পাবলিক রিভিউ',
        body: \`\${contributorName || newReviewName} \${newReviewRating} রেটিং দিয়েছেন\`,
        read: false,
        createdAt: new Date().toISOString(),
        link: 'reviews'
      });
      
      setReviewSubmitStatus('success');`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
