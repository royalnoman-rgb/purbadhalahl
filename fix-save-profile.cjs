const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      if (!docSnap.exists()) {
        if (!contributorPassword) {
            alert("নতুন প্রোফাইল তৈরি করার জন্য পাসওয়ার্ড দেওয়া বাধ্যতামূলক।");
            return;
        }
        if (!contributorDob) {
            alert("নতুন প্রোফাইল তৈরি করার জন্য জন্মতারিখ দেওয়া বাধ্যতামূলক।");
            return;
        }
        await setDoc(docRef, {
          ...updateData,
          phone: contributorPhone,
          approvedCount: 0,
          points: 0,
          createdAt: new Date().toISOString()
        });
        await processReferral(contributorPhone, contributorName || 'User');
      } else {
        await updateDoc(docRef, updateData);
      }
      
      alert('প্রোফাইল আপডেট করা হয়েছে!');`;

const replacement = `      if (!docSnap.exists()) {
        if (!contributorPassword) {
            alert("নতুন প্রোফাইল তৈরি করার জন্য পাসওয়ার্ড দেওয়া বাধ্যতামূলক।");
            return;
        }
        if (!contributorDob) {
            alert("নতুন প্রোফাইল তৈরি করার জন্য জন্মতারিখ দেওয়া বাধ্যতামূলক।");
            return;
        }
        await setDoc(docRef, {
          ...updateData,
          phone: contributorPhone,
          approvedCount: 0,
          points: 0,
          createdAt: new Date().toISOString()
        });
        await processReferral(contributorPhone, contributorName || 'User');
      } else {
        await updateDoc(docRef, updateData);
      }
      
      // Update local storage so session persists across refresh
      safeStorage.setItem('contributorName', contributorName);
      safeStorage.setItem('contributorPhone', contributorPhone);
      if (contributorEmail) safeStorage.setItem('contributorEmail', contributorEmail);
      if (contributorFacebook) safeStorage.setItem('contributorFacebook', contributorFacebook);
      if (contributorAvatar) safeStorage.setItem('contributorAvatar', contributorAvatar);
      if (contributorDob) safeStorage.setItem('contributorDob', contributorDob);
      
      alert('প্রোফাইল আপডেট করা হয়েছে!');`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed save profile local storage');
} else {
  console.log('Target not found');
}
