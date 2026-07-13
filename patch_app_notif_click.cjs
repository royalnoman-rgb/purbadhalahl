const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link === 'community') {
                            setShowCommunity(true);
                            setShowMap(false);
                            setSelectedCategory(null);
                          } else if (notif.link === 'messages' || notif.link === 'inbox' || notif.link === 'feedbacks' || notif.link === 'requests' || notif.link === 'reviews') {
                            if (isAdmin && notif.receiverPhone === 'admin') {
                                window.location.href = '/admin';
                            } else {
                                setIsContributorProfileOpen(true);
                            }
                          }
                        }}`;

const replacement = `                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link === 'community') {
                            setShowCommunity(true);
                            setShowMap(false);
                            setSelectedCategory(null);
                          } else if (notif.link === 'messages' || notif.link === 'inbox' || notif.link === 'feedbacks' || notif.link === 'requests' || notif.link === 'reviews') {
                            if (isAdmin && notif.receiverPhone === 'admin') {
                                window.location.href = \`/admin?tab=\${notif.link === 'messages' ? 'inbox' : notif.link}\`;
                            } else {
                                setIsContributorProfileOpen(true);
                                if (notif.link === 'messages' || notif.link === 'inbox') setActiveUserTab('messages');
                                else if (notif.link === 'requests') setActiveUserTab('contacts');
                                else if (notif.link === 'feedbacks') setActiveUserTab('feedbacks');
                            }
                          }
                        }}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched successfully.");
} else {
  console.log("Target not found!");
}
