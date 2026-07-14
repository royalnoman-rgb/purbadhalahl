import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const docRef = doc(db, 'contributors', '01710153764');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log(snap.data());
  } else {
    console.log('Contributor doc does not exist');
  }
}
run().then(() => process.exit(0)).catch(console.error);
