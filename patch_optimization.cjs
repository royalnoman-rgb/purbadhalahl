const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix fetchWithCache TTL and fallback
const fetchWithCacheTarget = `        if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000) { // 15 mins TTL
          setter(JSON.parse(cached));
          return;
        }

        const snapshot = await getDocs(q);`;

const fetchWithCacheReplacement = `        if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) { // 7 days TTL
          setter(JSON.parse(cached));
          return;
        }

        let snapshot;
        try {
          snapshot = await getDocs(q);
        } catch (err) {
          console.error("Firebase read failed, using fallback cache", err);
          if (cached) {
            setter(JSON.parse(cached));
          }
          return;
        }`;
code = code.replace(fetchWithCacheTarget, fetchWithCacheReplacement);

// 2. Fix fetchOnlineUsers interval
const fetchOnlineUsersTarget = `    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 60000);`;

const fetchOnlineUsersReplacement = `    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 15 * 60 * 1000); // 15 mins`;
code = code.replace(fetchOnlineUsersTarget, fetchOnlineUsersReplacement);

// 3. Fix updatePresence interval
const updatePresenceTarget = `      updatePresence();
      const interval = setInterval(updatePresence, 3 * 60 * 1000);`;

const updatePresenceReplacement = `      updatePresence();
      const interval = setInterval(updatePresence, 15 * 60 * 1000); // 15 mins`;
code = code.replace(updatePresenceTarget, updatePresenceReplacement);

// 4. Update fetchUserCount TTL
const fetchUserCountTarget = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 15 * 60 * 1000 && !isNaN(parsedCached)) {`;
const fetchUserCountReplacement = `if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000 && !isNaN(parsedCached)) {`;
code = code.replace(fetchUserCountTarget, fetchUserCountReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Optimizations applied successfully.');
