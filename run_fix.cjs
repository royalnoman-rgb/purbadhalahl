const fs = require('fs');
const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

async function fix() {
  const { initializeApp } = await import('firebase/app');
  const { getFirestore, collection, getDocs, writeBatch, doc } = await import('firebase/firestore');
  
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);
  
  const querySnapshot = await getDocs(collection(db, 'contacts'));
  const batch = writeBatch(db);
  let count = 0;
  
  querySnapshot.forEach((document) => {
    const data = document.data();
    if (!data.status) {
      batch.update(doc(db, 'contacts', document.id), { status: 'approved' });
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`Updated ${count} contacts with status: 'approved'`);
  } else {
    console.log('No contacts needed updating.');
  }
}

fix().catch(console.error);
