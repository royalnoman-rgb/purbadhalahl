const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetFetch = `      const deletedPostsQuery = query(collection(db, 'community_posts'), where('isDeleted', '==', true));
      const deletedPostsSnapshot = await getDocs(deletedPostsQuery);
      setDeletedPosts(deletedPostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));`;

const replaceFetch = `      const deletedPostsQuery = query(collection(db, 'community_posts'), where('isDeleted', '==', true));
      const deletedPostsSnapshot = await getDocs(deletedPostsQuery);
      const now = new Date();
      const validDeletedPosts: any[] = [];
      
      for (const d of deletedPostsSnapshot.docs) {
        const data = d.data();
        if (data.deletedAt) {
          const deletedDate = new Date(data.deletedAt);
          const diffDays = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24));
          // If older than 30 days, permanently delete it
          if (diffDays > 30) {
            await deleteDoc(d.ref);
            continue;
          }
        }
        validDeletedPosts.push({ id: d.id, ...data });
      }
      setDeletedPosts(validDeletedPosts);`;

code = code.replace(targetFetch, replaceFetch);
fs.writeFileSync('src/Admin.tsx', code);
