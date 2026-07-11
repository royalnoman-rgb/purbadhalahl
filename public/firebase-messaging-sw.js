importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwqRYHBKtR6jwQbmHZ2TCwYcXFf7PDdLI",
  authDomain: "eminent-range-2f4nj.firebaseapp.com",
  projectId: "eminent-range-2f4nj",
  storageBucket: "eminent-range-2f4nj.firebasestorage.app",
  messagingSenderId: "217745543210",
  appId: "1:217745543210:web:f9d56b903b09b41ef63353"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Add a valid icon path if you have one
    badge: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
