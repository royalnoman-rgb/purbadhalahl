const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const fetchOnlineUsersTarget = `    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 60000);`;
const fetchOnlineUsersReplacement = `    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 15 * 60 * 1000);`;

const updatePresenceTarget = `      updatePresence();
      const presenceInterval = setInterval(updatePresence, 3 * 60 * 1000);`;
const updatePresenceReplacement = `      updatePresence();
      const presenceInterval = setInterval(updatePresence, 15 * 60 * 1000);`;

code = code.replace(fetchOnlineUsersTarget, fetchOnlineUsersReplacement);
code = code.replace(updatePresenceTarget, updatePresenceReplacement);

fs.writeFileSync('src/Admin.tsx', code);
console.log('Admin optimizations applied successfully.');
