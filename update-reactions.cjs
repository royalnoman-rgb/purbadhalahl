const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`      await updateDoc(reviewRef, {
        likesArray,
        lovesArray,
        likes: likesArray.length,
        loves: lovesArray.length
      });`,
`      await updateDoc(reviewRef, {
        likesArray,
        lovesArray,
        likes: likesArray.length,
        loves: lovesArray.length
      });

      // Update local state immediately
      setPublicReviews(prev => prev.map(r => 
        r.id === review.id 
          ? { ...r, likesArray, lovesArray, likes: likesArray.length, loves: lovesArray.length }
          : r
      ));`
);
fs.writeFileSync('src/App.tsx', code);
