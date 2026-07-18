import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  apiKey: "dummy",
  projectId: "purvodhala-helpline",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
    const querySnapshot = await getDocs(collection(db, "online_users"));
    console.log("Online users count:", querySnapshot.size);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
    process.exit(0);
};
run();
