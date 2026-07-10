const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const targetDeletePost = `  const handleDeletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'community_posts', postId));
  };`;

const replaceDeletePost = `  const handleDeletePost = async (postId: string) => {
    if (window.confirm('পোস্টটি মুছে ফেলতে চান?')) {
      await updateDoc(doc(db, 'community_posts', postId), { 
        isDeleted: true, 
        deletedAt: new Date().toISOString() 
      });
    }
  };`;

code = code.replace(targetDeletePost, replaceDeletePost);

const targetDeleteComment = `  const handleDeleteComment = async (postId: string, commentId: string) => {
    const postRef = doc(db, 'community_posts', postId);
    const postDoc = await getDoc(postRef);
    if(postDoc.exists()) {
      const comments = postDoc.data().comments || [];
      await updateDoc(postRef, { comments: comments.filter((c: any) => c.id !== commentId) });
    }
  };`;

const replaceDeleteComment = `  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (window.confirm('মন্তব্যটি মুছে ফেলতে চান?')) {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if(postDoc.exists()) {
        const comments = postDoc.data().comments || [];
        await updateDoc(postRef, { comments: comments.map((c: any) => c.id === commentId ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() } : c) });
      }
    }
  };`;

code = code.replace(targetDeleteComment, replaceDeleteComment);

// Filter out deleted posts
code = code.replace(`setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));`, `setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => !p.isDeleted));`);

fs.writeFileSync('src/Community.tsx', code);
