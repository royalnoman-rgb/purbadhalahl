const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      localStorage.setItem('contributorName', contributorName);
      localStorage.setItem('contributorPhone', contributorPhone);
      localStorage.setItem('contributorFacebook', contributorFacebook);
      if (contributorAvatar) {
        localStorage.setItem('contributorAvatar', contributorAvatar);
      }`;

const replace = `      localStorage.setItem('contributorName', contributorName);
      localStorage.setItem('contributorPhone', contributorPhone);
      localStorage.setItem('contributorFacebook', contributorFacebook);
      if (contributorAvatar) {
        localStorage.setItem('contributorAvatar', contributorAvatar);
      }

      // Update authorName and authorAvatar in all community_posts by this user
      const postsQuery = query(collection(db, 'community_posts'), where('authorPhone', '==', contributorPhone));
      const postsSnapshot = await getDocs(postsQuery);
      const updatePromises = postsSnapshot.docs.map(postDoc => {
        return updateDoc(doc(db, 'community_posts', postDoc.id), {
          authorName: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      await Promise.all(updatePromises);
`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
