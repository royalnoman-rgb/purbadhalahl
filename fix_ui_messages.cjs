const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                      <button
                        onClick={handleSendUserMessage}
                        disabled={!userMessageText.trim()}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>`;

const replace = `                      <button
                        onClick={handleSendUserMessage}
                        disabled={!userMessageText.trim()}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">ইউজার থেকে ম্যাসেজ রিকোয়েস্ট</h3>
                      {userMessages.length === 0 ? (
                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg text-center">কোনো ম্যাসেজ নেই।</p>
                      ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {userMessages.map(msg => (
                            <div key={msg.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                              <div className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => setSelectedUserProfile(msg.senderPhone)}>
                                <div className="relative shrink-0">
                                  {msg.senderAvatar ? (
                                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                      <UserCircle className="w-4 h-4" />
                                    </div>
                                  )}
                                  {onlineUsers.includes(msg.senderPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <span className="font-semibold text-[11px] text-gray-900">{msg.senderName}</span>
                                  <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                                </div>
                              </div>
                              <p className="text-gray-800 text-xs whitespace-pre-wrap pl-8">{msg.message}</p>
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => setSelectedUserProfile(msg.senderPhone)}
                                  className="text-[10px] text-emerald-600 font-medium hover:text-emerald-700"
                                >
                                  প্রোফাইলে যান ও রিপ্লাই দিন
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>`;

if(code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Replaced");
} else {
  console.log("Not found");
}
