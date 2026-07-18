import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const contacts = await getDocs(collection(db, 'contacts'));
  contacts.forEach(c => {
    if (c.data().name.includes("আলী") || c.data().name.includes("আইয়োব")) {
      console.log("Contact:", c.id, c.data());
    }
  });
  
  process.exit(0);
}
check();
