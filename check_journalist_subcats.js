import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const catRef = doc(db, 'categories', 'journalists');
  const snap = await getDoc(catRef);
  if (snap.exists()) {
    console.log(snap.data());
  } else {
    console.log("No journalists category in DB");
  }
  process.exit(0);
}
check();
