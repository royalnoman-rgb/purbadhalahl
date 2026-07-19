const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const helper = `  const processReferral = async (newUserId: string, newUserName: string) => {
    const referredBy = safeStorage.getItem('referredBy');
    if (referredBy && referredBy !== newUserId) {
      try {
        const referrerRef = doc(db, 'contributors', referredBy);
        const referrerSnap = await getDoc(referrerRef);
        if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data();
          const currentPoints = referrerData.points || 0;
          await updateDoc(referrerRef, {
            points: currentPoints + 10
          });
          
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: referredBy,
            senderPhone: newUserId,
            type: 'referral_bonus',
            title: 'রেফারেল বোনাস!',
            body: \`আপনার ইনভাইট লিংক থেকে \${newUserName} জয়েন করেছেন। আপনি পেয়েছেন ১০ পয়েন্ট!\`,
            read: false,
            createdAt: new Date().toISOString(),
            link: 'profile'
          });
          
          safeStorage.removeItem('referredBy');
        }
      } catch (e) {
        console.error('Referral error:', e);
      }
    }
  };`;

code = code.replace('${helper}', helper);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed helper');
