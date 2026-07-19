const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const configPath = './firebase-applet-config.json';
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const app = initializeApp(config);
  const db = getFirestore(app);
  
  setDoc(doc(db, 'admin_auth', 'Admin@Secure2026!'), { created: true })
    .then(() => {
      console.log('Admin password document created!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
