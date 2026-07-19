import { initializeApp } from "firebase/app";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function check() {
  try {
    const coll = collection(db, 'contributors');
    const snapshot = await getCountFromServer(coll);
    console.log("Count:", snapshot.data().count);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
