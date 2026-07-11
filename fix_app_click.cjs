const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `} else if (notif.link === 'messages' || notif.link === 'inbox' || notif.link === 'feedbacks' || notif.link === 'requests' || notif.link === 'reviews') {
                            if (isAdmin) {
                                // admin inbox handled differently, but we can't easily redirect to admin dashboard from app unless window.location
                                window.location.href = '/admin';
                            } else {
                                setIsContributorProfileOpen(true);
                                // could set tab, but it defaults to stats, would be nice to open inbox. Just open profile for now
                            }
                          }`;

const replace = `} else if (notif.link === 'messages' || notif.link === 'inbox' || notif.link === 'feedbacks' || notif.link === 'requests' || notif.link === 'reviews') {
                            if (isAdmin && notif.receiverPhone === 'admin') {
                                window.location.href = '/admin';
                            } else {
                                setIsContributorProfileOpen(true);
                            }
                          }`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
