const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. imports - add deleteDoc if not there
if (!code.includes('deleteDoc')) {
    code = code.replace("updateDoc, deleteField } from 'firebase/firestore';", "updateDoc, deleteField, deleteDoc } from 'firebase/firestore';");
}

// 2. update listeners
const queryTarget = `      const userMessagesQuery = query(collection(db, 'user_messages'), where('receiverPhone', '==', contributorPhone));
      unsubUserMessages = onSnapshot(userMessagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort in memory instead of requiring composite index
        msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserMessages(msgs);
      });
    }
    return () => {
      if (unsubContributor) unsubContributor();
      if (unsubUserMessages) unsubUserMessages();
    };`;

const queryReplace = `      const receivedMessagesQuery = query(collection(db, 'user_messages'), where('receiverPhone', '==', contributorPhone));
      const sentMessagesQuery = query(collection(db, 'user_messages'), where('senderPhone', '==', contributorPhone));
      
      let receivedMsgs: any[] = [];
      let sentMsgs: any[] = [];

      const updateUnifiedMessages = () => {
         const all = [...receivedMsgs, ...sentMsgs].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
         const filtered = all.filter(msg => {
            if (msg.deletedForEveryone) return false;
            if (msg.deletedFor?.includes(contributorPhone)) return false;
            return true;
         });
         filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
         setUserMessages(filtered);
      };

      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        receivedMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        updateUnifiedMessages();
      });
      const unsubSent = onSnapshot(sentMessagesQuery, (snapshot) => {
        sentMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        updateUnifiedMessages();
      });
      
      // Store unsubSent to use in cleanup
      (window as any)._unsubSent = unsubSent;
    }
    return () => {
      if (unsubContributor) unsubContributor();
      if (unsubUserMessages) unsubUserMessages();
      if ((window as any)._unsubSent) (window as any)._unsubSent();
    };`;
    
code = code.replace(queryTarget, queryReplace);

const uiTarget = `                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
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
                        </div>`;

const uiReplace = `                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {userMessages.map(msg => {
                            const isSentByMe = msg.senderPhone === contributorPhone;
                            return (
                            <div key={msg.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                              <div className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => setSelectedUserProfile(isSentByMe ? msg.receiverPhone : msg.senderPhone)}>
                                <div className="relative shrink-0">
                                  {isSentByMe ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                      <Send className="w-3 h-3" />
                                    </div>
                                  ) : msg.senderAvatar ? (
                                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                      <UserCircle className="w-4 h-4" />
                                    </div>
                                  )}
                                  {!isSentByMe && onlineUsers.includes(msg.senderPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <span className="font-semibold text-[11px] text-gray-900">{isSentByMe ? \`To: \${msg.receiverName}\` : msg.senderName}</span>
                                  <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                                </div>
                              </div>
                              <p className="text-gray-800 text-xs whitespace-pre-wrap pl-8">{msg.message}</p>
                              <div className="flex justify-between items-center mt-2 pl-8">
                                <div className="flex gap-2">
                                  {isSentByMe ? (
                                    <span className={\`text-[10px] font-medium \${msg.read ? 'text-blue-500' : 'text-gray-400'}\`}>
                                      {msg.read ? 'Seen' : 'Delivered'}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleDeleteUserMessage(msg.id, false)} className="text-[10px] text-red-500 hover:text-red-600" title="Delete for me">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  {isSentByMe && (
                                    <button onClick={() => handleDeleteUserMessage(msg.id, true)} className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 px-1 rounded" title="Delete for everyone">
                                      সবার জন্য মুছুন
                                    </button>
                                  )}
                                  {!isSentByMe && (
                                    <button
                                      onClick={() => setSelectedUserProfile(msg.senderPhone)}
                                      className="text-[10px] text-emerald-600 font-medium hover:text-emerald-700"
                                    >
                                      রিপ্লাই দিন
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>`;

code = code.replace(uiTarget, uiReplace);

fs.writeFileSync('src/App.tsx', code);
