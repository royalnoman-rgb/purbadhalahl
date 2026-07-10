const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

code = code.replace("Trash2 } from 'lucide-react';", "Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';");

code = code.replace(
  "const [commentText, setCommentText] = useState<{ [key: string]: string }>({});",
  "const [commentText, setCommentText] = useState<{ [key: string]: string }>({});\n  const [editingPostId, setEditingPostId] = useState<string | null>(null);\n  const [editPostText, setEditPostText] = useState('');"
);

const handleEditPost = `  const handleUpdatePost = async (postId: string) => {
    if (!editPostText.trim()) return;
    await updateDoc(doc(db, 'community_posts', postId), { text: editPostText.trim() });
    setEditingPostId(null);
  };`;

code = code.replace("  const handleDeletePost", handleEditPost + "\n\n  const handleDeletePost");

const targetButtons = `{isAdmin && (
                <button 
                  onClick={() => handleDeletePost(post.id)} 
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}`;

const replaceButtons = `{(isAdmin || post.authorPhone === effectivePhone) && (
                <div className="absolute top-4 right-4 flex gap-2">
                  {post.authorPhone === effectivePhone && (
                    <button 
                      onClick={() => {
                        if (editingPostId === post.id) {
                          setEditingPostId(null);
                        } else {
                          setEditingPostId(post.id);
                          setEditPostText(post.text);
                        }
                      }} 
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"
                      title="Edit Post"
                    >
                      {editingPostId === post.id ? <XCircle className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeletePost(post.id)} 
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}`;

code = code.replace(targetButtons, replaceButtons);

const targetPostText = `<p className="text-gray-800 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
                {post.text}
              </p>`;

const replacePostText = `{editingPostId === post.id ? (
                <div className="mb-4">
                  <textarea
                    value={editPostText}
                    onChange={(e) => setEditPostText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm md:text-base"
                    rows={4}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleUpdatePost(post.id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> সেভ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
                  {post.text}
                </p>
              )}`;

code = code.replace(targetPostText, replacePostText);

fs.writeFileSync('src/Community.tsx', code);
