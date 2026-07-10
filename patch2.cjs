const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                            <button 
                              onClick={() => handleLikeReview(review)}
                              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                            >
                              <ThumbsUp className={\`w-3.5 h-3.5 \${JSON.parse(localStorage.getItem('likedReviews') || '[]').includes(review.id) ? 'text-emerald-600 fill-emerald-600' : ''}\`} />
                              <span>{review.likes || 0}</span>
                            </button>`;

const replacement = `                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                              <button
                                onClick={() => handleReviewReaction(review, 'like')}
                                className={\`flex items-center gap-1 hover:text-blue-600 transition-colors \${review.likesArray?.includes(getUserId()) || JSON.parse(localStorage.getItem('likedReviews') || '[]').includes(review.id) ? 'text-blue-600' : ''}\`}
                              >
                                <ThumbsUp className={\`w-4 h-4 \${review.likesArray?.includes(getUserId()) || JSON.parse(localStorage.getItem('likedReviews') || '[]').includes(review.id) ? 'fill-blue-600' : ''}\`} />
                                <span>{review.likesArray?.length > 0 ? review.likesArray.length : (review.likes > 0 ? review.likes : 'লাইক')}</span>
                              </button>
                              <button
                                onClick={() => handleReviewReaction(review, 'love')}
                                className={\`flex items-center gap-1 hover:text-red-500 transition-colors \${review.lovesArray?.includes(getUserId()) ? 'text-red-500' : ''}\`}
                              >
                                <Heart className={\`w-4 h-4 \${review.lovesArray?.includes(getUserId()) ? 'fill-red-500 text-red-500' : ''}\`} />
                                <span>{review.lovesArray?.length > 0 ? review.lovesArray.length : 'লাভ'}</span>
                              </button>
                            </div>`;

const newCode = code.replace(target, replacement);
if (code === newCode) {
  console.log("NOT REPLACED");
} else {
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("REPLACED");
}
