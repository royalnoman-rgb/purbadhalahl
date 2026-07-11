const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const uiTarget = `                        {contributorMessages.map(msg => (
                          <div key={msg.id} className="bg-white p-3 rounded shadow-sm">
                            <div className="flex justify-between items-center mb-1 border-b border-gray-50 pb-1">
                              <span className="font-semibold text-[11px] text-emerald-700 flex items-center">
                                <span className="relative">
                                  {msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}
                                  {msg.sender === 'admin' && onlineUsers.includes('admin') && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                  {msg.sender !== 'admin' && onlineUsers.includes(contributorPhone) && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                </span>
                                {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-3" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                            </div>
                            <p className="text-gray-800 text-xs whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        ))}`;

const uiReplace = `                        {contributorMessages.filter(msg => !msg.deletedForEveryone && !msg.deletedFor?.includes('user')).map(msg => (
                          <div key={msg.id} className="bg-white p-3 rounded shadow-sm">
                            <div className="flex justify-between items-center mb-1 border-b border-gray-50 pb-1">
                              <span className="font-semibold text-[11px] text-emerald-700 flex items-center">
                                <span className="relative">
                                  {msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}
                                  {msg.sender === 'admin' && onlineUsers.includes('admin') && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                  {msg.sender !== 'admin' && onlineUsers.includes(contributorPhone) && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                </span>
                                {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-3" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                            </div>
                            <p className="text-gray-800 text-xs whitespace-pre-wrap">{msg.message}</p>
                            <div className="flex justify-end items-center mt-2 gap-2">
                              {msg.sender === 'user' && (
                                <span className={\`text-[10px] font-medium \${msg.read ? 'text-blue-500' : 'text-gray-400'}\`}>
                                  {msg.read ? 'Seen' : 'Delivered'}
                                </span>
                              )}
                              <button onClick={() => handleDeleteContributorMessage(msg.id, false)} className="text-[10px] text-red-500 hover:text-red-600" title="Delete for me">
                                <Trash2 className="w-3 h-3" />
                              </button>
                              {msg.sender === 'user' && (
                                <button onClick={() => handleDeleteContributorMessage(msg.id, true)} className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 px-1 rounded" title="Delete for everyone">
                                  সবার জন্য মুছুন
                                </button>
                              )}
                            </div>
                          </div>
                        ))}`;

code = code.replace(uiTarget, uiReplace);
fs.writeFileSync('src/App.tsx', code);
