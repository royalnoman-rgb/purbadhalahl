const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      await updateDoc(reviewRef, { likesArray, lovesArray, likes: likesArray.length + lovesArray.length });
    } catch (err) {`;

const replacement = `      await updateDoc(reviewRef, { likesArray, lovesArray, likes: likesArray.length + lovesArray.length });
      
      const newReviewData = { ...review, likesArray, lovesArray, likes: likesArray.length + lovesArray.length };
      setPublicReviews(prev => {
        const newReviews = prev.map(r => r.id === review.id ? newReviewData : r);
        safeStorage.setItem('reviews_cache', JSON.stringify(newReviews));
        return newReviews;
      });
    } catch (err) {`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched reaction");
