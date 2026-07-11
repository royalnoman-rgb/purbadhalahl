const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target1 = `  const handleSendContributorMessage = async (id: string) => {`;
const replace1 = `  const handleDeleteContributorMessageAdmin = async (contId: string, msgId: string, deleteForEveryone: boolean) => {
    try {
      const contributorRef = doc(db, 'contributors', contId);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        const updatedMessages = messages.map((msg: any) => {
          if (msg.id === msgId) {
            if (deleteForEveryone) {
              return { ...msg, deletedForEveryone: true };
            } else {
              return { ...msg, deletedFor: [...(msg.deletedFor || []), 'admin'] };
            }
          }
          return msg;
        });
        await updateDoc(contributorRef, { messages: updatedMessages });
        fetchData();
      }
    } catch(e) { console.error(e); }
  };
  
  const handleMarkContributorMessagesRead = async (contId: string) => {
    try {
      const contributorRef = doc(db, 'contributors', contId);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        let updated = false;
        const updatedMessages = messages.map((msg: any) => {
          if (msg.sender === 'user' && !msg.read) {
            updated = true;
            return { ...msg, read: true };
          }
          return msg;
        });
        if (updated) {
          await updateDoc(contributorRef, { messages: updatedMessages, hasUnreadAdminMessage: false });
          fetchData();
        }
      }
    } catch(e) {}
  };

  const handleSendContributorMessage = async (id: string) => {`;
code = code.replace(target1, replace1);

const uiTarget = `                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                          {cont.messages.map((msg: any) => (
                            <div key={msg.id} className={\`p-2 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}\`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-[11px] text-gray-700">{msg.sender === 'admin' ? 'অ্যাডমিন' : cont.name}</span>
                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                              </div>
                              <p className="text-gray-800 text-xs">{msg.message}</p>
                            </div>
                          ))}
                        </div>`;

const uiReplace = `                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                          {cont.messages.filter((msg:any) => !msg.deletedForEveryone && !msg.deletedFor?.includes('admin')).map((msg: any) => (
                            <div key={msg.id} className={\`p-2 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}\`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-[11px] text-gray-700">{msg.sender === 'admin' ? 'অ্যাডমিন' : cont.name}</span>
                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                              </div>
                              <p className="text-gray-800 text-xs">{msg.message}</p>
                              <div className="flex justify-end items-center mt-1 gap-2">
                                {msg.sender === 'admin' && (
                                  <span className={\`text-[10px] font-medium \${msg.read ? 'text-blue-500' : 'text-gray-400'}\`}>
                                    {msg.read ? 'Seen' : 'Delivered'}
                                  </span>
                                )}
                                <button onClick={() => handleDeleteContributorMessageAdmin(cont.id, msg.id, false)} className="text-[10px] text-red-500 hover:text-red-600" title="Delete for me">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                {msg.sender === 'admin' && (
                                  <button onClick={() => handleDeleteContributorMessageAdmin(cont.id, msg.id, true)} className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 px-1 rounded" title="Delete for everyone">
                                    সবার জন্য মুছুন
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>`;

code = code.replace(uiTarget, uiReplace);
fs.writeFileSync('src/Admin.tsx', code);
