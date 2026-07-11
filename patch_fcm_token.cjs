const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { db, auth, googleProvider, facebookProvider } from './firebase';",
  "import { db, auth, googleProvider, facebookProvider, messaging, getToken, onMessage } from './firebase';"
);

// We want to add an effect to get FCM token when user logs in (when contributorPhone is set)
const effectCode = `
  useEffect(() => {
    if (contributorPhone && messaging) {
      // request permission
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // You need to replace 'YOUR_VAPID_KEY' with your actual VAPID key from Firebase console
          // For now, we will just try to get the token, if vapidKey is missing it might throw, but let's try
          getToken(messaging, { vapidKey: 'BM2dG7YkFm0zH_vJ4Y7xGj6Y_i3i3XzJ_g8k5_xT0K7u4y9D7D-k2T_L0j0i8Xw0' })
            .then((currentToken) => {
              if (currentToken) {
                console.log('FCM Token:', currentToken);
                updateDoc(doc(db, 'contributors', contributorPhone), {
                  fcmToken: currentToken
                }).catch(console.error);
              }
            }).catch(console.error);
            
          onMessage(messaging, (payload) => {
            console.log('Foreground message:', payload);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(payload.notification?.title || 'নতুন ম্যাসেজ', {
                body: payload.notification?.body,
                icon: '/icon.png'
              });
            }
          });
        }
      });
    }
  }, [contributorPhone]);
`;

code = code.replace("export default function App() {\n", "export default function App() {\n" + effectCode);

fs.writeFileSync('src/App.tsx', code);
