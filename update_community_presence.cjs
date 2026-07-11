const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

code = code.replace(
  "onUserClick: (phone: string) => void;",
  "onUserClick: (phone: string) => void;\n  onlineUsers: string[];"
);

code = code.replace(
  "onUserClick }: CommunityProps) {",
  "onUserClick, onlineUsers }: CommunityProps) {"
);

// 1. Update post authors
const postTarget = `                {post.authorPhone === 'admin' ? (
                  <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                    <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                ) : post.authorAvatar ? (
                  <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UserCircle className="w-6 h-6" />
                  </div>
                )}`;

const postReplace = `                <div className="relative shrink-0">
                  {post.authorPhone === 'admin' ? (
                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                      <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  ) : post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <UserCircle className="w-6 h-6" />
                    </div>
                  )}
                  {post.authorPhone !== 'admin' && onlineUsers.includes(post.authorPhone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>`;

code = code.replace(postTarget, postReplace);

// 2. Update comment authors
const commentTarget = `                            {comment.authorPhone === 'admin' ? (
                              <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white shrink-0">
                                <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                              </div>
                            ) : comment.authorAvatar ? (
                              <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                                <UserCircle className="w-4 h-4" />
                              </div>
                            )}`;

const commentReplace = `                            <div className="relative shrink-0">
                              {comment.authorPhone === 'admin' ? (
                                <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                                  <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                              ) : comment.authorAvatar ? (
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                  <UserCircle className="w-4 h-4" />
                                </div>
                              )}
                              {comment.authorPhone !== 'admin' && onlineUsers.includes(comment.authorPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>`;

code = code.replace(commentTarget, commentReplace);

fs.writeFileSync('src/Community.tsx', code);
