const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleLikeReview = async (review: any) => {
    if (contributorPhone && review.authorPhone === contributorPhone) {
      alert('আপনি নিজের রিভিওটিতে রেটিং/লাইক দিতে পারবেন না।');
      return;
    }

    const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
    if (likedReviews.includes(review.id)) {
      alert('আপনি ইতিমধ্যে এই রিভিওটিতে রেটিং/লাইক দিয়েছেন।');
      return;
    }

    try {
      await updateDoc(doc(db, 'public_reviews', review.id), {
        likes: (review.likes || 0) + 1
      });
      likedReviews.push(review.id);
      localStorage.setItem('likedReviews', JSON.stringify(likedReviews));
    } catch (err) {
      console.error("Error liking review", err);
    }
  };`;

const replacement = `  const getUserId = () => {
    if (contributorPhone) return contributorPhone;
    let did = localStorage.getItem('deviceId');
    if (!did) {
      did = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', did);
    }
    return did;
  };

  const handleReviewReaction = async (review: any, reactionType: 'like' | 'love') => {
    if (contributorPhone && review.authorPhone === contributorPhone) {
      alert('আপনি নিজের রিভিওটিতে রিয়েক্ট দিতে পারবেন না।');
      return;
    }
    const userId = getUserId();
    try {
      const reviewRef = doc(db, 'public_reviews', review.id);
      const reviewDoc = await getDoc(reviewRef);
      if (!reviewDoc.exists()) return;
      const data = reviewDoc.data();
      let likesArray = data.likesArray || [];
      let lovesArray = data.lovesArray || [];
      
      const hasLiked = likesArray.includes(userId);
      const hasLoved = lovesArray.includes(userId);
      
      if (reactionType === 'like') {
        if (hasLiked) {
          likesArray = likesArray.filter((id: string) => id !== userId);
        } else {
          likesArray.push(userId);
          lovesArray = lovesArray.filter((id: string) => id !== userId);
        }
      } else if (reactionType === 'love') {
        if (hasLoved) {
          lovesArray = lovesArray.filter((id: string) => id !== userId);
        } else {
          lovesArray.push(userId);
          likesArray = likesArray.filter((id: string) => id !== userId);
        }
      }
      await updateDoc(reviewRef, { likesArray, lovesArray, likes: likesArray.length + lovesArray.length });
    } catch (err) {
      console.error("Error reacting to review", err);
    }
  };`;

const newCode = code.replace(target, replacement);
if (code === newCode) {
  console.log("NOT REPLACED");
} else {
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("REPLACED");
}
