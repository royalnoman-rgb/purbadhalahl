const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the marker for the end of the received messages listener
const startMarker = `      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            // Only notify for new messages (created within the last 5 seconds)
            const isRecent = new Date().getTime() - new Date(data.createdAt).getTime() < 5000;
            if (isRecent && data.senderPhone !== contributorPhone && !data.read) {
               if ('Notification' in window && Notification.permission === 'granted') {
                 new Notification(\`নতুন ম্যাসেজ: \${data.senderName}\`, {
                   body: data.message
                 });
               }
            }
          }
        });
        receivedMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      });`;

// Find the marker for the alert inside handleForgotPassword
const endMarker = `            alert('আপনার একাউন্টে কোনো ইমেইল যুক্ত নেই। অনুগ্রহ করে নতুন করে একাউন্ট তৈরি করুন বা অ্যাডমিনের সাথে যোগাযোগ করুন।');`;

const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.error("Start marker not found!");
  process.exit(1);
}

const endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  console.error("End marker not found!");
  process.exit(1);
}

const before = content.substring(0, startIdx + startMarker.length);
const after = content.substring(endIdx);

const replacement = `

      const unsubSent = onSnapshot(sentMessagesQuery, (snapshot) => {
        sentMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      }, (error) => console.error("SentMsgs Snapshot Error:", error));
      
      // Store unsubSent to use in cleanup
      (window as any)._unsubSent = unsubSent;
    }
    return () => {
      if (unsubContributor) unsubContributor();
      if (unsubUserMessages) unsubUserMessages();
      if ((window as any)._unsubSent) (window as any)._unsubSent();
    };
  }, [contributorPhone, isEditProfileMode]);

  const handleDeleteUserMessage = async (msgId: string, deleteForEveryone: boolean) => {
    try {
      const msgRef = doc(db, 'user_messages', msgId);
      if (deleteForEveryone) {
        await updateDoc(msgRef, { deletedForEveryone: true });
      } else {
        const msgDoc = await getDoc(msgRef);
        if (msgDoc.exists()) {
          const data = msgDoc.data();
          await updateDoc(msgRef, { deletedFor: [...(data.deletedFor || []), contributorPhone] });
        }
      }
    } catch (error) {
      console.error(error);
      alert('ম্যাসেজ ডিলেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      alert('দয়া করে আপনার মোবাইল নাম্বার বা ইমেইল দিন।');
      return;
    }
    try {
      const isEmail = loginPhone.includes('@');
      let exists = false;
      let actualPhoneId = '';
      let targetEmail = '';

      if (isEmail) {
        const emailQuery = query(collection(db, 'contributors'), where('email', '==', loginPhone));
        const querySnapshot = await getDocs(emailQuery);
        if (!querySnapshot.empty) {
          exists = true;
          actualPhoneId = querySnapshot.docs[0].id;
          targetEmail = loginPhone;
        }
      } else {
        const phoneQuery = query(collection(db, 'contributors'), where('phone', '==', loginPhone));
        const querySnapshot = await getDocs(phoneQuery);
        if (!querySnapshot.empty) {
          exists = true;
          actualPhoneId = querySnapshot.docs[0].id;
          targetEmail = querySnapshot.docs[0].data().email || '';
        }
      }

      if (exists) {
        if (isEmail && !targetEmail) {`;

const newContent = before + replacement + after;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully fixed App.tsx!");
