import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, 'contacts'), where("categoryId", "==", "journalists"));
  const snap = await getDocs(q);
  const docs = [];
  snap.forEach(d => {
    docs.push(d.data());
  });
  docs.sort((a, b) => (a.order || 0) - (b.order || 0));
  docs.forEach(d => {
    console.log(`Order: ${d.order} | Name: ${d.name} | SubCat: ${d.subCategory}`);
  });
  process.exit(0);
}
check();
