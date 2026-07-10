const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `{post.authorAvatar ? (
                  <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UserCircle className="w-6 h-6" />
                  </div>
                )}`;
                
const replace = `{post.authorPhone === 'admin' ? (
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
                
code = code.replace(target, replace);

const commentTarget = `{comment.authorAvatar ? (
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200" />
                              ) : (
                                <UserCircle className="w-8 h-8 text-gray-400 shrink-0" />
                              )}`;

const commentReplace = `{comment.authorPhone === 'admin' ? (
                                <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white shrink-0">
                                  <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                              ) : comment.authorAvatar ? (
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200" />
                              ) : (
                                <UserCircle className="w-8 h-8 text-gray-400 shrink-0" />
                              )}`;

code = code.replace(commentTarget, commentReplace);

fs.writeFileSync('src/Community.tsx', code);
