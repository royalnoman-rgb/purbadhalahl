const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let newContent = content.replace(
`  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.password && data.password !== loginPassword) {
          alert('পাসওয়ার্ড ভুল হয়েছে!');
          return;
        }`,
`  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let docSnap: any = await getDoc(doc(db, 'contributors', loginPhone));
      let data: any = null;
      let actualPhoneId = loginPhone;

      if (docSnap.exists()) {
        data = docSnap.data();
      } else if (loginPhone.includes('@')) {
        const q = query(collection(db, 'contributors'), where('email', '==', loginPhone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          docSnap = querySnapshot.docs[0];
          data = docSnap.data();
          actualPhoneId = docSnap.id;
        }
      }

      if (data) {
        if (data.password && data.password !== loginPassword) {
          alert('পাসওয়ার্ড ভুল হয়েছে!');
          return;
        }`
);

newContent = newContent.replace(
`        setContributorPhone(data.phone || loginPhone);`,
`        setContributorPhone(actualPhoneId);`
);

newContent = newContent.replace(
`        safeStorage.setItem('contributorPhone', data.phone || loginPhone);`,
`        safeStorage.setItem('contributorPhone', actualPhoneId);`
);

newContent = newContent.replace(
`  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      alert('দয়া করে আপনার মোবাইল নাম্বার দিন।');
      return;
    }
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        setIsForgotPassword(false);
        setIsOtpMode(true);
        alert(\`আপনার নাম্বারে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।

(ডেমো কোড: \${otp})\`);
      } else {
        alert('এই নাম্বারে কোনো একাউন্ট পাওয়া যায়নি।');
      }
    } catch (err) {`,
`  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      alert('দয়া করে আপনার মোবাইল নাম্বার বা ইমেইল দিন।');
      return;
    }
    try {
      let exists = false;
      let actualPhoneId = loginPhone;
      let isEmail = loginPhone.includes('@');

      const docSnap = await getDoc(doc(db, 'contributors', loginPhone));
      if (docSnap.exists()) {
        exists = true;
      } else if (isEmail) {
        const q = query(collection(db, 'contributors'), where('email', '==', loginPhone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          exists = true;
          actualPhoneId = querySnapshot.docs[0].id;
        }
      }

      if (exists) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        // store the actual id so OTP verification resets the right account
        setLoginPhone(actualPhoneId);
        setIsForgotPassword(false);
        setIsOtpMode(true);
        alert(\`আপনার \${isEmail ? 'ইমেইলে' : 'নাম্বারে'} একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।

(ডেমো কোড: \${otp})\`);
      } else {
        alert('এই নাম্বার বা ইমেইলে কোনো একাউন্ট পাওয়া যায়নি।');
      }
    } catch (err) {`
);

// update labels
newContent = newContent.replace(
`<label className="block text-sm font-medium text-gray-700 mb-1">আপনার মোবাইল নাম্বারটি দিন। আমরা আপনার নাম্বারে একটি ভেরিফিকেশন কোড পাঠাবো।</label>`, // this might not match exactly, let's use regex
`...`
);

fs.writeFileSync('src/App.tsx', newContent);
console.log("Replaced");
