const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const targetCommentText = `<p className="text-gray-700 mb-1.5">{comment.text}</p>`;

const replaceCommentText = `{editingPostId === comment.id ? (
                          <div className="mb-2 mt-1">
                            <textarea
                              value={editPostText}
                              onChange={(e) => setEditPostText(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-xs"
                              rows={2}
                            />
                            <div className="flex justify-end mt-1">
                              <button
                                onClick={async () => {
                                  if (!editPostText.trim()) return;
                                  const postRef = doc(db, 'community_posts', post.id);
                                  const postDoc = await getDoc(postRef);
                                  if (postDoc.exists()) {
                                    const comments = postDoc.data().comments || [];
                                    await updateDoc(postRef, {
                                      comments: comments.map((c: any) => c.id === comment.id ? { ...c, text: editPostText.trim() } : c)
                                    });
                                    setEditingPostId(null);
                                  }
                                }}
                                className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium hover:bg-emerald-700 flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> সেভ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-1.5">{comment.text}</p>
                        )}`;

code = code.replace(targetCommentText, replaceCommentText);

const targetCommentHeader = `<span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>`;

const replaceCommentHeader = `<div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>
                            {(isAdmin || comment.authorPhone === effectivePhone) && (
                              <div className="flex gap-1">
                                {comment.authorPhone === effectivePhone && (
                                  <button
                                    onClick={() => {
                                      if (editingPostId === comment.id) {
                                        setEditingPostId(null);
                                      } else {
                                        setEditingPostId(comment.id);
                                        setEditPostText(comment.text);
                                      }
                                    }}
                                    className="text-blue-500 hover:bg-blue-50 p-0.5 rounded"
                                    title="Edit"
                                  >
                                    {editingPostId === comment.id ? <XCircle className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
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
                          </div>`;

code = code.replace(targetCommentHeader, replaceCommentHeader);

// And we must filter out deleted comments when rendering
code = code.replace(`{post.comments.map((comment: any) => (`, `{post.comments.filter((c: any) => !c.isDeleted).map((comment: any) => (`);

fs.writeFileSync('src/Community.tsx', code);
