import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const q1 = query(collection(db, 'contacts'), where('contributorPhone', '==', '01710153764'));
  const snap1 = await getDocs(q1);
  let contacts = [];
  snap1.forEach(doc => {
    contacts.push(doc.data());
  });
  console.log("Total contacts by user:", contacts.length);
  // how many approved?
  console.log("Approved:", contacts.filter(c => c.status === 'approved').length);
  console.log("Pending:", contacts.filter(c => c.status === 'pending').length);
}
run().then(() => process.exit(0)).catch(console.error);
