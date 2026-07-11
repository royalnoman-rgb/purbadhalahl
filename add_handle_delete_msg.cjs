const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const insertCode = `
  const handleDeleteContributorMessageAdmin = async (contributorId: string, msgId: string, deleteForEveryone: boolean) => {
    try {
      const contributorRef = doc(db, 'contributors', contributorId);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        let updatedMessages = data.messages || [];
        if (deleteForEveryone) {
          updatedMessages = updatedMessages.map((msg: any) => {
            if (msg.id === msgId) {
              return { ...msg, deletedForEveryone: true };
            }
            return msg;
          });
        } else {
          updatedMessages = updatedMessages.map((msg: any) => {
            if (msg.id === msgId) {
              return { ...msg, deletedFor: [...(msg.deletedFor || []), 'admin'] };
            }
            return msg;
          });
        }
        await updateDoc(contributorRef, { messages: updatedMessages });
        setContributors(prev => prev.map(c => c.id === contributorId ? { ...c, messages: updatedMessages } : c));
      }
    } catch (e) {
      console.error(e);
    }
  };
`;

if (!code.includes("handleDeleteContributorMessageAdmin = async")) {
  code = code.replace("const handleSendMessageToContributor = async", insertCode + "\n  const handleSendMessageToContributor = async");
  fs.writeFileSync('src/Admin.tsx', code);
}
