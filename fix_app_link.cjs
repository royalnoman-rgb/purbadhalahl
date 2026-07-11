const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `} else if (notif.link === 'messages') {`;
const replace = `} else if (notif.link === 'messages' || notif.link === 'inbox' || notif.link === 'feedbacks' || notif.link === 'requests' || notif.link === 'reviews') {`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
