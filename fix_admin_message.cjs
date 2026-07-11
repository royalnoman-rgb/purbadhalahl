const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const stateTarget = `const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});`;
const stateReplacement = `const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});
  const [adminMessageText, setAdminMessageText] = useState('');`;

code = code.replace(stateTarget, stateReplacement);

const funcTarget = `const handleMarkContributorMessageAsRead = async (id: string) => {`;
const funcReplacement = `const handleSendAdminMessage = async (contributorId: string) => {
    if (!adminMessageText.trim()) return;

    try {
      const contributorRef = doc(db, 'contributors', contributorId);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const newMessage = {
          id: Date.now().toString(),
          message: adminMessageText.trim(),
          sender: 'admin',
          createdAt: new Date().toISOString(),
          read: false
        };
        const updatedMessages = [...(data.messages || []), newMessage];
        await updateDoc(contributorRef, {
          messages: updatedMessages,
          hasUnreadMessage: true
        });
        setAdminMessageText('');
      }
    } catch (error) {
      console.error(error);
      alert('ম্যাসেজ পাঠাতে সমস্যা হয়েছে।');
    }
  };

  const handleMarkContributorMessageAsRead = async (id: string) => {`;

code = code.replace(funcTarget, funcReplacement);
fs.writeFileSync('src/Admin.tsx', code);
