const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `              <div className="flex items-center gap-3 mb-3">
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
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight flex items-center">
                    {post.authorName}
                    {post.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />)}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>`;

const replace = `              <div 
                className={\`flex items-center gap-3 mb-3 \${post.authorPhone !== 'admin' ? 'cursor-pointer hover:bg-gray-50 p-1 -m-1 rounded-lg transition-colors' : ''}\`}
                onClick={() => post.authorPhone !== 'admin' && onUserClick(post.authorPhone)}
              >
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
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight flex items-center">
                    {post.authorName}
                    {post.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />)}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>`;

code = code.replace(target, replace);
fs.writeFileSync('src/Community.tsx', code);
