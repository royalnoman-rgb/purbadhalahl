import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const cats = await getDocs(collection(db, 'categories'));
  cats.forEach(c => {
    console.log("Cat:", c.id, c.data());
  });
  
  process.exit(0);
}
check();
