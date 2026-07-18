import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const cats = await getDocs(collection(db, 'categories'));
  cats.forEach(c => {
    if (c.data().title.includes("সাংবাদিক")) {
      console.log("Cat:", c.id, c.data());
    }
  });

  const contacts = await getDocs(collection(db, 'contacts'));
  contacts.forEach(c => {
    if (c.data().subCategory && c.data().subCategory.includes("সাংবাদিক")) {
      console.log("Contact:", c.id, c.data());
    }
  });
  
  process.exit(0);
}
check();
