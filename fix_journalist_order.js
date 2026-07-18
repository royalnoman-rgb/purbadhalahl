import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const orderMap = {
  "আলী আহাম্মদ খান আইয়োব ": 1,
  "আলী আহাম্মদ খান আইয়োব": 1,
  "মো. জুলফিকার আলী শাহীন": 2,
  "শফিকুল আলম শাহীন": 3,
  "সৈয়দ আরিফুজ্জামান": 4,
  "ইসমাইল হোসেন খোকন": 5,
  "মো. জায়েজুল ইসলাম": 6,
  "মোহাম্মদ গোলাম মোস্তফা": 7,
  "তিলক রায় টুলু": 8,
  "মো. নূর উদ্দিন মন্ডল দুলাল": 9,
  "মো. নোমান শাহরিয়ার": 10
};

async function fix() {
  const contactsSnap = await getDocs(collection(db, 'contacts'));
  const batch = writeBatch(db);
  let count = 0;
  
  contactsSnap.forEach(snap => {
    const data = snap.data();
    if (data.categoryId === 'journalists') {
      const name = data.name.trim();
      if (orderMap[name] !== undefined) {
        console.log(`Setting order ${orderMap[name]} for ${data.name}`);
        batch.update(snap.ref, { 
          order: orderMap[name]
        });
        count++;
      } else {
        // If not in top 10, maybe give them higher order numbers to keep them below
        if (data.order < 11) {
            console.log(`Bumping order for ${data.name} to 10 + their current order`);
            batch.update(snap.ref, { order: 10 + (data.order || 0) });
            count++;
        }
      }
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`Updated ${count} contacts.`);
  } else {
    console.log("No contacts needed update.");
  }
  process.exit(0);
}

fix().catch(console.error);
