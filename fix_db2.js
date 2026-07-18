import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const contactsSnap = await getDocs(collection(db, 'contacts'));
  contactsSnap.forEach(snap => {
    const data = snap.data();
    if (data.categoryId === 'administration') {
      console.log(`Dynamic Contact: ${data.name} | Sub: ${data.subCategory}`);
    }
  });
  process.exit(0);
}
check().catch(console.error);
