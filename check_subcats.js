import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const docRef = doc(db, 'categories', 'journalists');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log(snap.data());
  }
  process.exit(0);
}
check();
