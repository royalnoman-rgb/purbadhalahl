const fs = require('fs');
let content = fs.readFileSync('src/MapTracker.tsx', 'utf8');

content = content.replace(
  `    const unsub = onSnapshot(q, (snapshot) => {
      const usersData: Record<string, any> = {};
      snapshot.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setActiveUsers(usersData);
    });`,
  `    const unsub = onSnapshot(q, (snapshot) => {
      const usersData: Record<string, any> = {};
      snapshot.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setActiveUsers(usersData);
    }, (error) => console.error("MapTracker Snapshot Error:", error));`
);

fs.writeFileSync('src/MapTracker.tsx', content);
console.log("Patched MapTracker.tsx");
