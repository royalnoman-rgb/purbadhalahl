const fs = require('fs');
const file = 'src/Community.tsx';
let code = fs.readFileSync(file, 'utf8');

// add deleteDoc import
code = code.replace(
  `import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';`,
  `import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';`
);

// add Trash2 import
code = code.replace(
  `import { Users, Lock, Send, UserCircle, MessageCircle, ArrowLeft, ThumbsUp, Heart } from 'lucide-react';`,
  `import { Users, Lock, Send, UserCircle, MessageCircle, ArrowLeft, ThumbsUp, Heart, Trash2 } from 'lucide-react';`
);

// add isAdmin and delete functions
const targetHooks = `  useEffect(() => {`;
const replaceHooks = `  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  const handleDeletePost = async (postId: string) => {
    if(window.confirm('পোস্টটি মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'community_posts', postId));
    }
  };
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if(window.confirm('মন্তব্যটি মুছে ফেলতে চান?')) {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if(postDoc.exists()) {
        const comments = postDoc.data().comments || [];
        await updateDoc(postRef, { comments: comments.filter((c: any) => c.id !== commentId) });
      }
    }
  };
  useEffect(() => {`;
code = code.replace(targetHooks, replaceHooks);

// Add delete button to posts
const targetPostUI = `                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight flex items-center">
                    {post.authorName}
                    {isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>`;

const replacePostUI = `                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight flex items-center">
                    {post.authorName}
                    {isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => handleDeletePost(post.id)} 
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}`;

code = code.replace(targetPostUI, replacePostUI);
// To make absolute positioning work for the delete button:
code = code.replace(
  `            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">`,
  `            <div key={post.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-4">`
);

// Let's add delete button to comments
const targetCommentUI = `                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-xs text-gray-800 flex items-center">
                          {comment.authorName}
                          {isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />}
                        </span>
                        <div className="flex items-center gap-2">`;
                        
const replaceCommentUI = `                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-xs text-gray-800 flex items-center">
                          {comment.authorName}
                          {isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />}
                        </span>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button onClick={() => handleDeleteComment(post.id, comment.id)} className="text-red-400 hover:text-red-600 p-1" title="Delete Comment">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}`;

code = code.replace(targetCommentUI, replaceCommentUI);

fs.writeFileSync(file, code);
