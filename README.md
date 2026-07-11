# Background Push Notifications Instructions

To send a message via Node.js script using firebase-admin, you would do something like this:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  notification: {
    title: 'নতুন ম্যাসেজ',
    body: 'আপনি একটি নতুন ম্যাসেজ পেয়েছেন!'
  },
  token: '<USER_FCM_TOKEN>'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
```
