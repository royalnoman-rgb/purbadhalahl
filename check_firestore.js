import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  projectId: "ai-studio-purbadhalaphoned-dd7504b0-3e4e-4b20-8669-857e1a76b2dd"
});
const db = getFirestore(app);

async function check() {
  const docRef = doc(db, 'contacts', 'fn4');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document fn4 exists in Firestore!");
  } else {
    console.log("No such document!");
  }
}
check();
