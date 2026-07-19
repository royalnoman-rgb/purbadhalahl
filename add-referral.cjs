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

if (!code.includes('processReferral')) {
  // insert after handleShareApp
  code = code.replace(
    `const handleShareApp = async () => {`,
    `\${helper}\n\n  const handleShareApp = async () => {`
  );
  
  // Now add inside handleSocialLogin
  code = code.replace(
    `          points: 0,
          createdAt: new Date().toISOString()
        });
        
        setContributorName`,
    `          points: 0,
          createdAt: new Date().toISOString()
        });
        
        await processReferral(phoneId, user.displayName || 'Unnamed User');
        
        setContributorName`
  );
  
  // Now add inside saveContributorProfile
  code = code.replace(
    `          points: 0,
          createdAt: new Date().toISOString()
        });
      } else {`,
    `          points: 0,
          createdAt: new Date().toISOString()
        });
        await processReferral(contributorPhone, contributorName || 'User');
      } else {`
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log('Referral logic injected');
}
