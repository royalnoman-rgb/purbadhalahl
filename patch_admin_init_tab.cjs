const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>('requests');";
const replacement = `const initialTab = new URLSearchParams(window.location.search).get('tab') as any || 'requests';
  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>(['requests', 'feedbacks', 'reviews', 'contributors', 'history', 'recycle', 'inbox', 'data'].includes(initialTab) ? initialTab : 'requests');`;

content = content.replace(target, replacement);

// And update the notification click handler in Admin.tsx
const notifClickTarget = `                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link) {
                            setActiveTab(notif.link === 'messages' ? 'inbox' : notif.link as any);
                          }
                        }}`;
const notifClickReplacement = `                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link) {
                            const newTab = notif.link === 'messages' ? 'inbox' : notif.link as any;
                            if (['requests', 'feedbacks', 'reviews', 'contributors', 'history', 'recycle', 'inbox', 'data'].includes(newTab)) {
                              setActiveTab(newTab);
                            }
                          }
                        }}`;
content = content.replace(notifClickTarget, notifClickReplacement);

fs.writeFileSync('src/Admin.tsx', content);
