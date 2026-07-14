const fs = require('fs');
let content = fs.readFileSync('src/Community.tsx', 'utf8');

content = content.replace(
  `    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).filter((p: any) => !p.isDeleted));
    });`,
  `    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).filter((p: any) => !p.isDeleted));
    }, (error) => console.error("Community Posts Snapshot Error:", error));`
);

fs.writeFileSync('src/Community.tsx', content);
console.log("Patched Community.tsx");
