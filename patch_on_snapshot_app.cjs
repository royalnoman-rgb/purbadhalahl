const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `    const unsubNotif = onSnapshot(qNotif, (snapshot) => {`,
  `    const unsubNotif = onSnapshot(qNotif, (snapshot) => {`
);

content = content.replace(
  `      const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
      
      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > (safeStorage.getItem('lastNotifCount') ? parseInt(safeStorage.getItem('lastNotifCount')!) : 0) && !isInitialLoad.current) {
        playNotificationSound();
        showBrowserNotification('নতুন নোটিফিকেশন', 'আপনার জন্য একটি নতুন নোটিফিকেশন আছে।');
      }
      safeStorage.setItem('lastNotifCount', unreadCount.toString());
      
      isInitialLoad.current = false;
    });`,
  `      const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
      
      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > (safeStorage.getItem('lastNotifCount') ? parseInt(safeStorage.getItem('lastNotifCount')!) : 0) && !isInitialLoad.current) {
        playNotificationSound();
        showBrowserNotification('নতুন নোটিফিকেশন', 'আপনার জন্য একটি নতুন নোটিফিকেশন আছে।');
      }
      safeStorage.setItem('lastNotifCount', unreadCount.toString());
      
      isInitialLoad.current = false;
    }, (error) => console.error("Notif Snapshot Error:", error));`
);

content = content.replace(
  `      unsubContributor = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');
        } else {
          // Account was deleted
          safeStorage.removeItem('contributorName');
          safeStorage.removeItem('contributorPhone');
          safeStorage.removeItem('contributorFacebook');
          safeStorage.removeItem('contributorAvatar');
          safeStorage.removeItem('hasPassword');
          setContributorName('');
          setContributorPhone('');
          setContributorFacebook('');
          setContributorAvatar('');
          setContributorPassword('');
          setContributorPoints(0);
          setContributorApprovedCount(0);
          setIsContributorProfileOpen(false);
        }
      });`,
  `      unsubContributor = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) safeStorage.setItem('hasPassword', 'true');
          else safeStorage.removeItem('hasPassword');
        } else {
          // Account was deleted
          safeStorage.removeItem('contributorName');
          safeStorage.removeItem('contributorPhone');
          safeStorage.removeItem('contributorFacebook');
          safeStorage.removeItem('contributorAvatar');
          safeStorage.removeItem('hasPassword');
          setContributorName('');
          setContributorPhone('');
          setContributorFacebook('');
          setContributorAvatar('');
          setContributorPassword('');
          setContributorPoints(0);
          setContributorApprovedCount(0);
          setIsContributorProfileOpen(false);
        }
      }, (error) => console.error("Contributor Snapshot Error:", error));`
);

content = content.replace(
  `      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            // Only notify for new messages (created within the last 5 seconds)
            const isRecent = new Date().getTime() - new Date(data.createdAt).getTime() < 5000;
            if (isRecent) {
               playNotificationSound();
               showBrowserNotification('নতুন ম্যাসেজ', \`\${data.senderName} আপনাকে ম্যাসেজ পাঠিয়েছেন\`);
            }
          }
        });
        receivedMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      });`,
  `      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            // Only notify for new messages (created within the last 5 seconds)
            const isRecent = new Date().getTime() - new Date(data.createdAt).getTime() < 5000;
            if (isRecent) {
               playNotificationSound();
               showBrowserNotification('নতুন ম্যাসেজ', \`\${data.senderName} আপনাকে ম্যাসেজ পাঠিয়েছেন\`);
            }
          }
        });
        receivedMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      }, (error) => console.error("ReceivedMsgs Snapshot Error:", error));`
);

content = content.replace(
  `      const unsubSent = onSnapshot(sentMessagesQuery, (snapshot) => {
        sentMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      });`,
  `      const unsubSent = onSnapshot(sentMessagesQuery, (snapshot) => {
        sentMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      }, (error) => console.error("SentMsgs Snapshot Error:", error));`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
