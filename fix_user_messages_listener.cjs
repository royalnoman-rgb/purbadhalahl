const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    let unsubContributor: any = null;
    if (isContributorProfileOpen && contributorPhone) {
      fetchContributorStats();
      
      const docRef = doc(db, 'contributors', contributorPhone);
      unsubContributor = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');
        }
      });
    }
    return () => {
      if (unsubContributor) unsubContributor();
    };`;

const replace = `    let unsubContributor: any = null;
    let unsubUserMessages: any = null;
    if (isContributorProfileOpen && contributorPhone) {
      fetchContributorStats();
      
      const docRef = doc(db, 'contributors', contributorPhone);
      unsubContributor = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');
        }
      });

      const userMessagesQuery = query(collection(db, 'user_messages'), where('receiverPhone', '==', contributorPhone));
      unsubUserMessages = onSnapshot(userMessagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort in memory instead of requiring composite index
        msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserMessages(msgs);
      });
    }
    return () => {
      if (unsubContributor) unsubContributor();
      if (unsubUserMessages) unsubUserMessages();
    };`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
