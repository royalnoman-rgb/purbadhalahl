const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `        } else {
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
  `        } else {
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
  `      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > prevNotifCount.current && !isInitialLoad.current) {
        // new notification arrived
        playNotificationSound();
        const newest = notifs.find(n => !n.read);
        if (newest) {
          showBrowserNotification(newest.title, newest.body);
        }
      }
      prevNotifCount.current = unreadCount;
      
      isInitialLoad.current = false;
    });`,
  `      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > prevNotifCount.current && !isInitialLoad.current) {
        // new notification arrived
        playNotificationSound();
        const newest = notifs.find(n => !n.read);
        if (newest) {
          showBrowserNotification(newest.title, newest.body);
        }
      }
      prevNotifCount.current = unreadCount;
      
      isInitialLoad.current = false;
    }, (error) => console.error("Notif Snapshot Error:", error));`
);

content = content.replace(
  `            if (isRecent && data.senderPhone !== contributorPhone && !data.read) {
               if ('Notification' in window && Notification.permission === 'granted') {
                 new Notification(\`নতুন ম্যাসেজ: \${data.senderName}\`, {
                   body: data.message
                 });
               }
               playNotificationSound();
            }
          }
        });
        receivedMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      });`,
  `            if (isRecent && data.senderPhone !== contributorPhone && !data.read) {
               if ('Notification' in window && Notification.permission === 'granted') {
                 new Notification(\`নতুন ম্যাসেজ: \${data.senderName}\`, {
                   body: data.message
                 });
               }
               playNotificationSound();
            }
          }
        });
        receivedMsgs = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
        updateUnifiedMessages();
      }, (error) => console.error("ReceivedMsgs Snapshot Error:", error));`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
