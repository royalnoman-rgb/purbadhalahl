const fs = require('fs');

// 1. Fix src/App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Fix handleReviewSubmit to include authorAvatar
const addReviewTarget = `      await addDoc(collection(db, 'public_reviews'), {
        name: contributorName || newReviewName,
        rating: newReviewRating,
        message: newReviewMessage,
        createdAt: new Date().toISOString(),
        likes: 0,
        authorPhone: contributorPhone || ''
      });`;
const addReviewReplace = `      await addDoc(collection(db, 'public_reviews'), {
        name: contributorName || newReviewName,
        rating: newReviewRating,
        message: newReviewMessage,
        createdAt: new Date().toISOString(),
        likes: 0,
        authorPhone: contributorPhone || '',
        authorAvatar: contributorAvatar || ''
      });`;
appCode = appCode.replace(addReviewTarget, addReviewReplace);

// Fix saveContributorProfile to update public_reviews and comments
const saveProfileTarget = `      const updatePromises = postsSnapshot.docs.map(postDoc => {
        return updateDoc(doc(db, 'community_posts', postDoc.id), {
          authorName: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      await Promise.all(updatePromises);`;
const saveProfileReplace = `      const updatePromises = postsSnapshot.docs.map(postDoc => {
        return updateDoc(doc(db, 'community_posts', postDoc.id), {
          authorName: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      
      // Update public_reviews
      const reviewsQuery = query(collection(db, 'public_reviews'), where('authorPhone', '==', contributorPhone));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewUpdatePromises = reviewsSnapshot.docs.map(reviewDoc => {
        return updateDoc(doc(db, 'public_reviews', reviewDoc.id), {
          name: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      
      // Update comments in community_posts
      const allPostsSnapshot = await getDocs(collection(db, 'community_posts'));
      const commentUpdatePromises = allPostsSnapshot.docs.map(postDoc => {
        const postData = postDoc.data();
        let updated = false;
        const newComments = (postData.comments || []).map((c) => {
          if (c.authorPhone === contributorPhone) {
            updated = true;
            return { ...c, authorName: contributorName, authorAvatar: contributorAvatar || '' };
          }
          return c;
        });
        if (updated) {
          return updateDoc(doc(db, 'community_posts', postDoc.id), { comments: newComments });
        }
        return Promise.resolve();
      });

      await Promise.all([...updatePromises, ...reviewUpdatePromises, ...commentUpdatePromises]);`;
appCode = appCode.replace(saveProfileTarget, saveProfileReplace);

// Update reviews render
const reviewRenderTarget = `                      {publicReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              {review.name}
                              {isVerifiedContributor(review.name) && <VerifiedBadge />}
                            </h3>
                            <div className="flex gap-0.5">
                              {[...Array(review.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.message}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60">`;
const reviewRenderReplace = `                      {publicReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-start gap-3 mb-2">
                            {review.authorAvatar ? (
                              <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                <UserCircle className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                  {review.name}
                                  {isVerifiedContributor(review.name) && <VerifiedBadge />}
                                </h3>
                                <div className="flex gap-0.5">
                                  {[...Array(review.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{review.message}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60">`;
appCode = appCode.replace(reviewRenderTarget, reviewRenderReplace);

fs.writeFileSync('src/App.tsx', appCode);


// 2. Fix src/Community.tsx
let commCode = fs.readFileSync('src/Community.tsx', 'utf8');

const commentSubmitTarget = `          authorName: effectiveName || 'Unknown',
          authorPhone: effectivePhone,
          text: text,
          createdAt: new Date().toISOString(),`;
const commentSubmitReplace = `          authorName: effectiveName || 'Unknown',
          authorPhone: effectivePhone,
          authorAvatar: effectiveAvatar || '',
          text: text,
          createdAt: new Date().toISOString(),`;
commCode = commCode.replace(commentSubmitTarget, commentSubmitReplace);

const commentRenderTarget = `                    {post.comments.filter((c: any) => !c.isDeleted).map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-900 flex items-center">
                            {comment.authorName}
                            {comment.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>
                            {(isAdmin || comment.authorPhone === effectivePhone) && (
                              <div className="flex gap-1">`;
const commentRenderReplace = `                    {post.comments.filter((c: any) => !c.isDeleted).map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-start gap-2 mb-1">
                          {comment.authorPhone === 'admin' ? (
                            <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white shrink-0">
                              <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                          ) : comment.authorAvatar ? (
                            <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                              <UserCircle className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-gray-900 flex items-center">
                                {comment.authorName}
                                {comment.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>
                                {(isAdmin || comment.authorPhone === effectivePhone) && (
                                  <div className="flex gap-1">`;
commCode = commCode.replace(commentRenderTarget, commentRenderReplace);

// Fix the closing tags for comment render
const commentRenderClosingTarget = `                                    {editingPostId === comment.id ? <XCircle className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingPostId === comment.id ? (`;
const commentRenderClosingReplace = `                                    {editingPostId === comment.id ? <XCircle className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingPostId === comment.id ? (`;
// The closing was already correct but let's check it. Wait, the structure changed from `flex justify-between items-start` to `flex items-start gap-2 mb-1` wrapper around the avatar and then a `.flex-1` with `flex justify-between items-start`. We need to add an extra closing `</div>` for `.flex-1`.
// Let's not use string replace for closing, I'll use regex.
commCode = commCode.replace(
  /(\{\(isAdmin \|\| comment\.authorPhone === effectivePhone\) && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*)(<p className="text-gray-800 whitespace-pre-wrap mt-0\.5">)/,
  '$1</div>$2'
);
fs.writeFileSync('src/Community.tsx', commCode);

