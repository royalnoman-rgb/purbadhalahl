const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    // Check if they are already logged in
    if (!contributorPhone) {
      const hasSeen = safeStorage.getItem('hasSeenWelcomeNotice_v3');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowWelcomeNotice(true);
          safeStorage.setItem('hasSeenWelcomeNotice_v3', 'true');
        }, 1500); // show after 1.5 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [contributorPhone]);`;

const replEffect = `  useEffect(() => {
    // Check if they are already logged in
    if (!contributorPhone) {
      const hasSeen = safeStorage.getItem('hasSeenWelcomeNotice_v4');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowWelcomeNotice(true);
        }, 1500); // show after 1.5 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [contributorPhone]);`;

const targetClose1 = `className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowWelcomeNotice(false)}`;
const replClose1 = `className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => { safeStorage.setItem('hasSeenWelcomeNotice_v4', 'true'); setShowWelcomeNotice(false); }}`;

const targetClose2 = `onClick={() => {
                     setShowWelcomeNotice(false);
                     setIsContributorProfileOpen(true);
                   }}`;
const replClose2 = `onClick={() => {
                     safeStorage.setItem('hasSeenWelcomeNotice_v4', 'true');
                     setShowWelcomeNotice(false);
                     setIsContributorProfileOpen(true);
                   }}`;

const targetClose3 = `onClick={() => setShowWelcomeNotice(false)}`;
const replClose3 = `onClick={() => { safeStorage.setItem('hasSeenWelcomeNotice_v4', 'true'); setShowWelcomeNotice(false); }}`;

if (appCode.includes(targetEffect)) {
  appCode = appCode.replace(targetEffect, replEffect);
} else { console.log("Fail 1") }
if (appCode.includes(targetClose1)) {
  appCode = appCode.replace(targetClose1, replClose1);
} else { console.log("Fail 2") }
if (appCode.includes(targetClose2)) {
  appCode = appCode.replace(targetClose2, replClose2);
} else { console.log("Fail 3") }
if (appCode.includes(targetClose3)) {
  appCode = appCode.replace(targetClose3, replClose3);
} else { console.log("Fail 4") }

fs.writeFileSync('src/App.tsx', appCode);
console.log('Successfully patched Welcome Notice v4');
