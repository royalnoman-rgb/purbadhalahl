const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { db, auth, googleProvider, facebookProvider } from './firebase';",
  "import { db, auth, googleProvider, facebookProvider } from './firebase';"
);

// We need to insert handleSocialLogin before handleLogin
const socialLoginCode = `
  const handleSocialLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const phoneId = user.uid; // Using UID as "phone" for social logins
      const docRef = doc(db, 'contributors', phoneId);
      const docSnap = await getDoc(docRef);
      
      // Auto Facebook Profile Picture logic: if it's facebook, providerData might have a photoURL that is higher quality, but user.photoURL is fine
      let avatar = user.photoURL || '';
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName || 'Unnamed User',
          phone: phoneId,
          email: user.email || '',
          facebookUrl: '',
          avatar: avatar,
          approvedCount: 0,
          points: 0,
          createdAt: new Date().toISOString()
        });
        
        setContributorName(user.displayName || 'Unnamed User');
        setContributorPhone(phoneId);
        setContributorAvatar(avatar);
        setHasPassword(false);
        localStorage.setItem('contributorName', user.displayName || 'Unnamed User');
        localStorage.setItem('contributorPhone', phoneId);
        if(avatar) localStorage.setItem('contributorAvatar', avatar);
        
        alert(\`স্বাগতম \${user.displayName || ''}! আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে।\`);
      } else {
        const data = docSnap.data();
        setContributorName(data.name || '');
        setContributorPhone(phoneId);
        setContributorFacebook(data.facebookUrl || '');
        setContributorAvatar(data.avatar || avatar); // update avatar if existing doesn't have one
        setContributorPassword(data.password || '');
        setHasPassword(!!data.password);
        if (data.password) localStorage.setItem('hasPassword', 'true');
        else localStorage.removeItem('hasPassword');
        
        localStorage.setItem('contributorName', data.name || '');
        localStorage.setItem('contributorPhone', phoneId);
        if(data.avatar || avatar) localStorage.setItem('contributorAvatar', data.avatar || avatar);
        
        alert(\`স্বাগতম \${data.name || ''}! আপনার প্রোফাইল সফলভাবে লগইন হয়েছে।\`);
      }
      
      setIsLoginMode(false);
      setIsContributorProfileOpen(false);
    } catch (err) {
      console.error(err);
      alert('লগইন করতে সমস্যা হয়েছে।');
    }
  };
`;

code = code.replace('const handleLogin = async (e: React.FormEvent) => {', socialLoginCode + '\\n  const handleLogin = async (e: React.FormEvent) => {');

fs.writeFileSync('src/App.tsx', code);
