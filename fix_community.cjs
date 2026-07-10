const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `  const handleDeleteComment = async (postId: string, commentId: string) => {
    const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if(postDoc.exists()) {
        const comments = postDoc.data().comments || [];
        await updateDoc(postRef, { comments: comments.filter((c: any) => c.id !== commentId));
      }
    }
  };`;

const replacement = `  const handleDeleteComment = async (postId: string, commentId: string) => {
    const postRef = doc(db, 'community_posts', postId);
    const postDoc = await getDoc(postRef);
    if(postDoc.exists()) {
      const comments = postDoc.data().comments || [];
      await updateDoc(postRef, { comments: comments.filter((c: any) => c.id !== commentId) });
    }
  };`;

code = code.replace(target, replacement);

fs.writeFileSync('src/Community.tsx', code);
