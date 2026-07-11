const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = `useEffect(() => {
    // Fetch approved categories`;

const hookReplacement = `useEffect(() => {
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const showBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  useEffect(() => {
    if (!contributorPhone && !isAdmin) return;
    const receiverId = isAdmin ? 'admin' : contributorPhone;
    const qNotif = query(collection(db, 'notifications'), where('receiverPhone', '==', receiverId));
    
    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
      
      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > prevNotifCount.current) {
        // new notification arrived
        playNotificationSound();
        const newest = notifs.find(n => !n.read);
        if (newest) {
          showBrowserNotification(newest.title, newest.body);
        }
      }
      prevNotifCount.current = unreadCount;
    });
    return () => unsubNotif();
  }, [contributorPhone, isAdmin]);

  useEffect(() => {
    // Fetch approved categories`;

code = code.replace(hookTarget, hookReplacement);
fs.writeFileSync('src/App.tsx', code);
