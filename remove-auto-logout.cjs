const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          // Account was indeed deleted
          safeStorage.removeItem('contributorName');
          safeStorage.removeItem('contributorPhone');
          safeStorage.removeItem('contributorFacebook');
          safeStorage.removeItem('contributorAvatar');
          safeStorage.removeItem('contributorDob');
          safeStorage.removeItem('hasPassword');
          safeStorage.removeItem('contributorRole');
          setContributorName('');
          setContributorPhone('');
          setContributorFacebook('');
          setContributorAvatar('');
          setContributorDob('');
          setContributorPassword('');
          setHasPassword(false);
          setIsContributorProfileOpen(false);
          alert('আপনার একাউন্টটি মুছে ফেলা হয়েছে।');`;

const replacement = `          // Account was indeed deleted
          // DO NOTHING automatically to prevent false positive logouts due to cache or transient network issues.
          // If the account was really deleted, their writes will fail.
          console.warn('Account appears deleted, but preventing auto-logout to avoid false positives.');`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Removed auto-logout');
} else {
  console.log('Target not found');
}
