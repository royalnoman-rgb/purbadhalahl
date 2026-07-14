const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      const newReviewData = { ...review, likesArray, lovesArray, likes: likesArray.length + lovesArray.length };
      setPublicReviews(prev => {
        const newReviews = prev.map(r => r.id === review.id ? newReviewData : r);
        safeStorage.setItem('reviews_cache', JSON.stringify(newReviews));
        return newReviews;
      });
    } catch (err) {`;

const replacement = `      const newReviewData = { ...review, likesArray, lovesArray, likes: likesArray.length + lovesArray.length };
      setPublicReviews(prev => {
        const newReviews = prev.map(r => r.id === review.id ? newReviewData : r);
        safeStorage.setItem('reviews_cache', JSON.stringify(newReviews));
        return newReviews;
      });
      
      const likedReviews = JSON.parse(safeStorage.getItem('likedReviews') || '[]');
      if (reactionType === 'like' && !hasLiked) {
        safeStorage.setItem('likedReviews', JSON.stringify([...likedReviews, review.id]));
      } else if (reactionType === 'like' && hasLiked) {
        safeStorage.setItem('likedReviews', JSON.stringify(likedReviews.filter(id => id !== review.id)));
      }
    } catch (err) {`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched reaction safeStorage");
