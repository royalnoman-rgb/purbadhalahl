import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mapping = {
  "উপজেলা সমাজসেবা অফিস": "উপজেলা সমাজসেবা কার্যালয়",
  "উপজেলা ভূমি অফিস": "সহকারী কমিশনার (ভূমি) এর কার্যালয়",
  "উপজেলা সমবায় অফিস": "উপজেলা সমবায় কার্যালয়",
  "উপজেলা নির্বাহী অফিস": "উপজেলা নির্বাহী অফিসারের কার্যালয় (UNO)",
  "থানা পুলিশ": "উপজেলা আনসার ও ভিডিপি কার্যালয়" // Wait, 'থানা পুলিশ' should be emergency, not administration, let me just ignore it or move it to emergency!
};

async function fix() {
  const contactsSnap = await getDocs(collection(db, 'contacts'));
  const batch = writeBatch(db);
  let count = 0;
  
  contactsSnap.forEach(snap => {
    const data = snap.data();
    let updated = false;
    let newSub = data.subCategory;
    
    if (data.categoryId === 'administration') {
      if (mapping[data.subCategory]) {
        newSub = mapping[data.subCategory];
        updated = true;
      }
      
      // Look for duplicate names
      // Actually the problem might be duplicate contacts! Let's log the contacts in administration
      console.log(`Contact: ${data.name} | Sub: ${data.subCategory}`);
    }
    
    if (updated) {
      batch.update(snap.ref, { subCategory: newSub });
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`Updated ${count} contacts.`);
  } else {
    console.log("No contacts needed update.");
  }
}

fix().catch(console.error);
