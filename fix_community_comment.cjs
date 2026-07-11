const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const targetMsg = `await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          authorName: effectiveName || 'Unknown',
          authorPhone: effectivePhone,
          authorAvatar: effectiveAvatar || '',
          text: text,
          createdAt: new Date().toISOString(),
          likes: [],
          loves: []
        })
      });
      setCommentText({ ...commentText, [postId]: '' });`;

const replacementMsg = `await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          authorName: effectiveName || 'Unknown',
          authorPhone: effectivePhone,
          authorAvatar: effectiveAvatar || '',
          text: text,
          createdAt: new Date().toISOString(),
          likes: [],
          loves: []
        })
      });
      
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        if (postData.authorPhone !== effectivePhone && postData.authorPhone) {
           await addDoc(collection(db, 'notifications'), {
              receiverPhone: postData.authorPhone,
              type: 'comment',
              title: \`\${effectiveName} আপনার পোস্টে মন্তব্য করেছেন\`,
              body: text,
              read: false,
              createdAt: new Date().toISOString(),
              link: 'community'
           });
        }
      }

      setCommentText({ ...commentText, [postId]: '' });`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/Community.tsx', code);
