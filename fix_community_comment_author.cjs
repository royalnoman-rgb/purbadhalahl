const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `                        <div className="flex items-start gap-2 mb-1">
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
                              </span>`;

const replace = `                        <div className="flex items-start gap-2 mb-1">
                          <div 
                            className={\`flex items-start gap-2 \${comment.authorPhone !== 'admin' ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}\`}
                            onClick={() => comment.authorPhone !== 'admin' && onUserClick(comment.authorPhone)}
                          >
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
                            <span className="font-semibold text-gray-900 flex items-center mt-0.5">
                              {comment.authorName}
                              {comment.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-end items-start">`;

code = code.replace(target, replace);
fs.writeFileSync('src/Community.tsx', code);
