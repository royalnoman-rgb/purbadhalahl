const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  // Presence setup
  useEffect(() => {
    if (!contributorPhone) return;
    const updatePresence = async () => {
      try {
        await updateDoc(doc(db, 'contributors', contributorPhone), {
          lastActive: Date.now()
        });
      } catch (e) {}
    };
    updatePresence();
    const interval = setInterval(updatePresence, 3 * 60 * 1000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updatePresence();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contributorPhone]);`;

const replace = `  // Presence setup
  useEffect(() => {
    const updatePresence = async () => {
      try {
        if (isAdmin) {
          await setDoc(doc(db, 'contributors', 'admin'), {
            lastActive: Date.now()
          }, { merge: true });
        }
        if (contributorPhone) {
          await updateDoc(doc(db, 'contributors', contributorPhone), {
            lastActive: Date.now()
          });
        }
      } catch (e) {}
    };
    if (contributorPhone || isAdmin) {
      updatePresence();
      const interval = setInterval(updatePresence, 3 * 60 * 1000);
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') updatePresence();
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [contributorPhone, isAdmin]);`;

if(code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log("App.tsx Updated");
} else {
  console.log("App.tsx Target not found");
}

let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');
const adminTarget = `  useEffect(() => {
    if (isAuthenticated) {
      fetchData();`;

const adminReplace = `  useEffect(() => {
    const updatePresence = async () => {
      try {
        await setDoc(doc(db, 'contributors', 'admin'), {
          lastActive: Date.now()
        }, { merge: true });
      } catch (e) {}
    };
    
    if (isAuthenticated) {
      updatePresence();
      const presenceInterval = setInterval(updatePresence, 3 * 60 * 1000);
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') updatePresence();
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      fetchData();`;

const adminTargetEnd = `        setContributors(contList);
      });
      return () => unsub();
    }
  }, [isAuthenticated]);`;

const adminReplaceEnd = `        setContributors(contList);
      });
      return () => {
        unsub();
        clearInterval(presenceInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isAuthenticated]);`;

if (adminCode.includes(adminTarget) && adminCode.includes(adminTargetEnd)) {
  adminCode = adminCode.replace(adminTarget, adminReplace);
  adminCode = adminCode.replace(adminTargetEnd, adminReplaceEnd);
  fs.writeFileSync('src/Admin.tsx', adminCode);
  console.log("Admin.tsx Updated");
} else {
  console.log("Admin.tsx Target not found");
}

