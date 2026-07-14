import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const batch = writeBatch(db);
  let count = 0;

  // 1. Update contacts
  const q1 = query(collection(db, 'contacts'), where('subCategory', '==', 'স্কুল/কলেজ/মাদ্রাসা'));
  const snap1 = await getDocs(q1);
  snap1.forEach(d => {
    batch.update(d.ref, { subCategory: 'স্কুল' });
    count++;
  });

  // 1b. Update contacts with other variants just in case
  const q1b = query(collection(db, 'contacts'), where('subCategory', '==', 'স্কুল, কলেজ ও মাদ্রাসা'));
  const snap1b = await getDocs(q1b);
  snap1b.forEach(d => {
    batch.update(d.ref, { subCategory: 'স্কুল' });
    count++;
  });

  // 2. Delete or update subcategories if any
  const q2 = query(collection(db, 'subcategories'), where('title', '==', 'স্কুল/কলেজ/মাদ্রাসা'));
  const snap2 = await getDocs(q2);
  snap2.forEach(d => {
    // maybe just delete them since we have predefined?
    batch.delete(d.ref);
    count++;
  });

  const q3 = query(collection(db, 'subcategories'), where('title', '==', 'স্কুল, কলেজ ও মাদ্রাসা'));
  const snap3 = await getDocs(q3);
  snap3.forEach(d => {
    batch.delete(d.ref);
    count++;
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Updated/deleted ${count} records.`);
  } else {
    console.log("No records needed updating.");
  }
}

run().then(() => process.exit(0)).catch(console.error);
