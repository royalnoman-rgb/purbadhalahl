const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes('activeReactionMsgId')) {
  // Add state
  code = code.replace(
    "const [adminMessageText, setAdminMessageText] = useState('');",
    "const [adminMessageText, setAdminMessageText] = useState('');\n  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);"
  );

  // Add handleReactToMessageAdmin function
  const reactFn = `
  const handleReactToMessageAdmin = async (contributorId: string, msgId: string, emoji: string) => {
    try {
      const contributorRef = doc(db, 'contributors', contributorId);
      const cont = contributors.find(c => c.id === contributorId);
      if (!cont) return;
      const updatedMessages = cont.messages.map((msg: any) => {
        if (msg.id === msgId) {
          return { ...msg, reaction: emoji };
        }
        return msg;
      });
      await updateDoc(contributorRef, { messages: updatedMessages });
      setContributors(prev => prev.map(c => c.id === contributorId ? { ...c, messages: updatedMessages } : c));
      setActiveReactionMsgId(null);
    } catch(e) {
      console.error(e);
    }
  };
`;
  
  code = code.replace(
    "const handleSendAdminMessage = async (contributorId: string) => {",
    reactFn + "\n  const handleSendAdminMessage = async (contributorId: string) => {"
  );

  // Add reaction UI to contributor messages in Inbox
  const inboxMsgTarget = `<p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                            </div>`;
  const inboxMsgReplace = `<p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                              {msg.reaction && (
                                <div className="absolute -bottom-2 right-2 bg-white rounded-full shadow border border-gray-100 px-1.5 py-0.5 text-[10px] z-10">{msg.reaction}</div>
                              )}
                              <div className="flex justify-end mt-1 relative">
                                <button onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)} className="text-[10px] text-gray-400 hover:text-gray-600 px-1" title="React">
                                  <Smile className="w-3 h-3" />
                                </button>
                                {activeReactionMsgId === msg.id && (
                                  <div className="absolute z-20 bottom-full right-0 mb-1 bg-white shadow-lg border border-gray-200 rounded-full flex gap-1 p-1">
                                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(e => (
                                      <button key={e} onClick={() => handleReactToMessageAdmin(cont.id, msg.id, e)} className="hover:bg-gray-100 p-1 rounded-full text-sm transition-transform hover:scale-110">
                                        {e}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>`;
  
  code = code.replace(inboxMsgTarget, inboxMsgReplace);

  // Add reaction UI to contributor messages in Manage Contributors tab
  const manageMsgTarget = `<div className="flex justify-end items-center mt-1 gap-2">`;
  const manageMsgReplace = `{msg.reaction && (
                                <div className="absolute -bottom-2 right-2 bg-white rounded-full shadow border border-gray-100 px-1.5 py-0.5 text-[10px] z-10">{msg.reaction}</div>
                              )}
                              <div className="flex justify-end items-center mt-1 gap-2 relative">
                                <button onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)} className="text-[10px] text-gray-400 hover:text-gray-600 px-1" title="React">
                                  <Smile className="w-3 h-3" />
                                </button>
                                {activeReactionMsgId === msg.id && (
                                  <div className="absolute z-20 bottom-full right-0 mb-1 bg-white shadow-lg border border-gray-200 rounded-full flex gap-1 p-1">
                                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(e => (
                                      <button key={e} onClick={() => handleReactToMessageAdmin(cont.id, msg.id, e)} className="hover:bg-gray-100 p-1 rounded-full text-sm transition-transform hover:scale-110">
                                        {e}
                                      </button>
                                    ))}
                                  </div>
                                )}`;
  
  code = code.replace(manageMsgTarget, manageMsgReplace);

  code = code.replaceAll(
    `className={\`p-3 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-blue-100 ml-8' : 'bg-white border border-gray-200 mr-8'}\`}`,
    `className={\`relative p-3 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-blue-100 ml-8' : 'bg-white border border-gray-200 mr-8'}\`}`
  );

  code = code.replaceAll(
    `className={\`p-2 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}\`}`,
    `className={\`relative p-2 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}\`}`
  );
}

fs.writeFileSync('src/Admin.tsx', code);
