const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('handleReviewComment')) {
  code = code.replace(
    'const handleReviewReaction = async',
    `const handleReviewComment = async (reviewId: string) => {
    if (!contributorPhone) {
      alert('কমেন্ট করতে হলে আপনাকে লগইন করতে হবে।');
      return;
    }
    const text = reviewCommentTexts[reviewId]?.trim();
    if (!text) return;

    try {
      const reviewRef = doc(db, 'public_reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      if (!reviewDoc.exists()) return;
      
      const data = reviewDoc.data();
      const currentComments = data.comments || [];
      const newComment = {
        id: Math.random().toString(36).substring(2, 9),
        authorPhone: contributorPhone,
        authorName: contributorName || 'User',
        authorAvatar: safeStorage.getItem('contributorAvatar') || '',
        text,
        createdAt: new Date().toISOString()
      };

      const updatedComments = [...currentComments, newComment];
      await updateDoc(reviewRef, { comments: updatedComments });

      setPublicReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, comments: updatedComments } : r
      ));
      
      setReviewCommentTexts(prev => ({ ...prev, [reviewId]: '' }));
      
      // Notify author
      if (data.authorPhone && data.authorPhone !== contributorPhone) {
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: data.authorPhone,
          senderPhone: contributorPhone,
          type: 'review_comment',
          title: 'আপনার রিভিওতে নতুন কমেন্ট',
          body: \`\${contributorName || 'User'} আপনার রিভিওতে কমেন্ট করেছেন।\`,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'reviews'
        });
      }
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  const handleReviewReaction = async`
  );
  fs.writeFileSync('src/App.tsx', code);
}
