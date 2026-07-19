const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
`    const fetchUserCount = async () => {
      try {
        const snapshot = await getCountFromServer(collection(db, 'contributors'));
        setTotalUsersCount(snapshot.data().count);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserCount();`,
`    const fetchUserCount = async () => {
      try {
        const cached = safeStorage.getItem('totalUsersCount');
        const cacheTime = safeStorage.getItem('totalUsersCount_time');
        const now = Date.now();
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 1 * 60 * 1000) {
          setTotalUsersCount(parseInt(cached));
        } else {
          const snapshot = await getCountFromServer(collection(db, 'contributors'));
          const count = snapshot.data().count;
          setTotalUsersCount(count);
          safeStorage.setItem('totalUsersCount', count.toString());
          safeStorage.setItem('totalUsersCount_time', now.toString());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserCount();`
);
fs.writeFileSync('src/App.tsx', code);
