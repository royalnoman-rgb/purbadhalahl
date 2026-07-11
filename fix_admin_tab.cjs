const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetClick = `if (notif.link) {
                            setActiveTab(notif.link as any);
                          }`;
const replaceClick = `if (notif.link) {
                            setActiveTab(notif.link === 'messages' ? 'inbox' : notif.link as any);
                          }`;

code = code.replace(targetClick, replaceClick);
fs.writeFileSync('src/Admin.tsx', code);
