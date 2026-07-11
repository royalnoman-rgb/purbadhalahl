const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const notifCode = `
      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
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
        receivedMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        updateUnifiedMessages();
      });
`;

code = code.replace(/unsubUserMessages = onSnapshot\(receivedMessagesQuery, \(snapshot\) => {[\s\S]*?updateUnifiedMessages\(\);\n      }\);/, notifCode.trim());

const reqCode = `
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
`;
code = code.replace("export default function App() {\n", "export default function App() {\n" + reqCode);

fs.writeFileSync('src/App.tsx', code);
