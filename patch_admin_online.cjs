const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!content.includes('const [onlineUsers, setOnlineUsers]')) {
  const stateTarget = "  const [allCats, setAllCats] = useState<any[]>([]);";
  const stateReplacement = "  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);\n  const [allCats, setAllCats] = useState<any[]>([]);";
  content = content.replace(stateTarget, stateReplacement);

  const fetchTarget = "  useEffect(() => {\n    const updatePresence = async () => {";
  const fetchReplacement = `  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const threshold = Date.now() - 5 * 60 * 1000;
        const q = query(collection(db, 'contributors'), where('lastActive', '>', threshold));
        const snapshot = await getDocs(q);
        setOnlineUsers(snapshot.docs.map(d => d.id));
      } catch(e) {}
    };
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatePresence = async () => {`;
  content = content.replace(fetchTarget, fetchReplacement);
  
  // Add green dot to contributors list
  // Look for: {cont.name}
  // And {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}
  const contribTarget = `<span className="flex items-center">\n                          {cont.name}\n                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}\n                        </span>`;
  const contribReplacement = `<span className="flex items-center relative">\n                          {cont.name}\n                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}\n                          {onlineUsers.includes(cont.id) && <span className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>}\n                        </span>`;
  content = content.replace(contribTarget, contribReplacement);

  // Add green dot to inbox list
  const inboxTarget = `<h3 className="font-bold text-gray-900 flex items-center gap-2">\n                            {cont.name}\n                            {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}\n                          </h3>`;
  const inboxReplacement = `<h3 className="font-bold text-gray-900 flex items-center gap-2 relative w-fit">\n                            {cont.name}\n                            {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}\n                            {onlineUsers.includes(cont.id) && <span className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>}\n                          </h3>`;
  content = content.replace(inboxTarget, inboxReplacement);

  fs.writeFileSync('src/Admin.tsx', content);
  console.log("Patched Admin.tsx");
} else {
  console.log("Already patched.");
}
