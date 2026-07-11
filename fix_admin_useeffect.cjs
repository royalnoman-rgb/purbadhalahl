const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetEffect = `useEffect(() => {
    const updatePresence = async () => {`;

const replacementEffect = `useEffect(() => {
    if (!isAuthenticated) return;
    
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const qNotif = query(collection(db, 'notifications'), where('receiverPhone', '==', 'admin'));
    
    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
      
      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > prevNotifCount.current) {
        // new notification arrived
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
        
        const newest = notifs.find(n => !n.read);
        if (newest && "Notification" in window && Notification.permission === "granted") {
          new Notification(newest.title, { body: newest.body, icon: '/logo.png' });
        }
      }
      prevNotifCount.current = unreadCount;
    });
    
    return () => unsubNotif();
  }, [isAuthenticated]);

  useEffect(() => {
    const updatePresence = async () => {`;

code = code.replace(targetEffect, replacementEffect);
fs.writeFileSync('src/Admin.tsx', code);
