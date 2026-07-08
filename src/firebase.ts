import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwqRYHBKtR6jwQbmHZ2TCwYcXFf7PDdLI",
  authDomain: "eminent-range-2f4nj.firebaseapp.com",
  projectId: "eminent-range-2f4nj",
  storageBucket: "eminent-range-2f4nj.firebasestorage.app",
  messagingSenderId: "217745543210",
  appId: "1:217745543210:web:f9d56b903b09b41ef63353"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
