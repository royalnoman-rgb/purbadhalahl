import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const q1 = query(collection(db, 'contacts'), where('contributorPhone', '==', '01710153764'));
  const snap1 = await getDocs(q1);
  snap1.forEach(doc => {
    console.log(doc.id, doc.data().contributorName, doc.data().contributorPhone);
  });
}
run().then(() => process.exit(0)).catch(console.error);
