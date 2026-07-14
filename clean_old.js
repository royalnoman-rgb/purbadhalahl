import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const q1 = query(collection(db, 'contacts'), where('replacesId', '!=', null));
  const snap1 = await getDocs(q1);
  for (const d of snap1.docs) {
    if (d.data().status === 'approved') {
      const oldId = d.data().replacesId;
      console.log('Deleting old contact', oldId);
      try {
        await deleteDoc(doc(db, 'contacts', oldId));
      } catch(e) { console.log("error", e.message) }
    }
  }
}
run().then(() => process.exit(0)).catch(console.error);
