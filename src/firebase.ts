import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export let messaging = null;
try {
  messaging = getMessaging(app);
} catch(e) {
  console.log('Firebase messaging not supported', e);
}
export { getToken, onMessage };
