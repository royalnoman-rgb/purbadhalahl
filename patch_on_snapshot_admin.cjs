const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

content = content.replace(
  `    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
    });`,
  `    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
    }, (error) => console.error("Admin Notif Snapshot Error:", error));`
);

content = content.replace(
  `      const unsub = onSnapshot(q, (snapshot) => {
        const contList = snapshot.docs
          .map(d => ({ ...d.data(), id: d.id } as any))
          .filter(c => c.id !== 'admin');
        
        contList.sort((a, b) => {
          if (a.points !== b.points) return (b.points || 0) - (a.points || 0);
          return (b.approvedCount || 0) - (a.approvedCount || 0);
        });
        
        setContributors(contList);
      });`,
  `      const unsub = onSnapshot(q, (snapshot) => {
        const contList = snapshot.docs
          .map(d => ({ ...d.data(), id: d.id } as any))
          .filter(c => c.id !== 'admin');
        
        contList.sort((a, b) => {
          if (a.points !== b.points) return (b.points || 0) - (a.points || 0);
          return (b.approvedCount || 0) - (a.approvedCount || 0);
        });
        
        setContributors(contList);
      }, (error) => console.error("Admin Contributors Snapshot Error:", error));`
);

fs.writeFileSync('src/Admin.tsx', content);
console.log("Patched Admin.tsx");
