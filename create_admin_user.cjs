const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');

const configPath = './firebase-applet-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, 'admin@purbadhala.com', 'Admin@Secure2026!')
  .then((userCredential) => {
    console.log('Admin user created in Firebase Auth with UID:', userCredential.user.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
