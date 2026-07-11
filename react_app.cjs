const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('activeReactionMsgId')) {
  // Add state
  code = code.replace(
    "const [activeUserTab, setActiveUserTab] = useState<'stats' | 'contacts' | 'feedbacks' | 'messages'>('stats');",
    "const [activeUserTab, setActiveUserTab] = useState<'stats' | 'contacts' | 'feedbacks' | 'messages'>('stats');\n  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);"
  );

  // Add handleReactToMessage function
  const reactFn = `
  const handleReactToMessage = async (msgId: string, emoji: string, isUserMessage: boolean = false) => {
    try {
      if (isUserMessage) {
        await updateDoc(doc(db, 'user_messages', msgId), { reaction: emoji });
      } else {
        const contributorRef = doc(db, 'contributors', contributorPhone);
        const updatedMessages = contributorMessages.map((msg: any) => {
          if (msg.id === msgId) {
            return { ...msg, reaction: emoji };
          }
          return msg;
        });
        await updateDoc(contributorRef, { messages: updatedMessages });
        setContributorMessages(updatedMessages);
      }
      setActiveReactionMsgId(null);
    } catch(e) {
      console.error(e);
    }
  };
`;
  
  code = code.replace(
    "const handleSendUserMessage = async () => {",
    reactFn + "\n  const handleSendUserMessage = async () => {"
  );

  code = code.replaceAll(
    `<div key={msg.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">`,
    `<div key={msg.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 relative">`
  );

  // Add reaction UI to contributor messages
  const contMsgTarget = `<div className="flex justify-end items-center mt-2 gap-2">`;
  const contMsgReplace = `{msg.reaction && (
                              <div className="absolute -bottom-2 right-2 bg-white rounded-full shadow border border-gray-100 px-1.5 py-0.5 text-xs z-10">{msg.reaction}</div>
                            )}
                            <div className="flex justify-end items-center mt-2 gap-2 relative">
                              <button onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)} className="text-[10px] text-gray-400 hover:text-gray-600 px-1" title="React">
                                <Smile className="w-3 h-3" />
                              </button>
                              {activeReactionMsgId === msg.id && (
                                <div className="absolute z-20 bottom-full right-0 mb-1 bg-white shadow-lg border border-gray-200 rounded-full flex gap-1 p-1">
                                  {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(e => (
                                    <button key={e} onClick={() => handleReactToMessage(msg.id, e, false)} className="hover:bg-gray-100 p-1 rounded-full text-sm transition-transform hover:scale-110">
                                      {e}
                                    </button>
                                  ))}
                                </div>
                              )}`;
  
  // Replace only the first occurrence for contributor messages, and second occurrence for user messages?
  // Let's replace the first one
  code = code.replace(contMsgTarget, contMsgReplace);
  
  // Second occurrence for user messages
  const userMsgReplace = `{msg.reaction && (
                                <div className="absolute -bottom-2 right-2 bg-white rounded-full shadow border border-gray-100 px-1.5 py-0.5 text-xs z-10">{msg.reaction}</div>
                              )}
                              <div className="flex justify-between items-center mt-2 pl-8 relative">
                                <div className="flex gap-2 relative">
                                  <button onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)} className="text-[10px] text-gray-400 hover:text-gray-600 px-1" title="React">
                                    <Smile className="w-3 h-3" />
                                  </button>
                                  {activeReactionMsgId === msg.id && (
                                    <div className="absolute z-20 bottom-full left-0 mb-1 bg-white shadow-lg border border-gray-200 rounded-full flex gap-1 p-1">
                                      {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(e => (
                                        <button key={e} onClick={() => handleReactToMessage(msg.id, e, true)} className="hover:bg-gray-100 p-1 rounded-full text-sm transition-transform hover:scale-110">
                                          {e}
                                        </button>
                                      ))}
                                    </div>
                                  )}`;
                                  
  const userMsgTarget = `<div className="flex justify-between items-center mt-2 pl-8">
                                <div className="flex gap-2">`;
  
  code = code.replace(userMsgTarget, userMsgReplace);
}

fs.writeFileSync('src/App.tsx', code);
