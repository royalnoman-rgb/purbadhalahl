const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [showCommunity, setShowCommunity] = useState(false);",
  "const [showCommunity, setShowCommunity] = useState(false);\n  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);"
);

// 2. Add useEffects for presence
const presenceCode = `  // Presence setup
  useEffect(() => {
    if (!contributorPhone) return;
    const updatePresence = async () => {
      try {
        await updateDoc(doc(db, 'contributors', contributorPhone), {
          lastActive: Date.now()
        });
      } catch (e) {}
    };
    updatePresence();
    const interval = setInterval(updatePresence, 3 * 60 * 1000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updatePresence();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contributorPhone]);

  useEffect(() => {
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
`;

code = code.replace(
  "useEffect(() => {\n    const savedName = localStorage.getItem('contributorName');",
  presenceCode + "\n  useEffect(() => {\n    const savedName = localStorage.getItem('contributorName');"
);

// 3. Update Community props
code = code.replace(
  "onUserClick={setSelectedUserProfile}",
  "onUserClick={setSelectedUserProfile}\n            onlineUsers={onlineUsers}"
);

// 4. Update UserProfileModal props
code = code.replace(
  "currentUserAvatar={contributorAvatar} />",
  "currentUserAvatar={contributorAvatar} onlineUsers={onlineUsers} />"
);

// 5. Update topContributors rendering
const topContributorsTarget = `                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                            <UserCircle className="w-6 h-6" />
                          </div>
                        )}`;

const topContributorsReplace = `                        <div className="relative shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <UserCircle className="w-6 h-6" />
                            </div>
                          )}
                          {onlineUsers.includes(user.phone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>`;

code = code.replace(topContributorsTarget, topContributorsReplace);

// 6. Update reviews rendering
const reviewsTarget = `                              {review.authorAvatar ? (
                                <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                  <UserCircle className="w-6 h-6" />
                                </div>
                              )}`;

const reviewsReplace = `                              <div className="relative shrink-0">
                                {review.authorAvatar ? (
                                  <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <UserCircle className="w-6 h-6" />
                                  </div>
                                )}
                                {review.authorPhone && onlineUsers.includes(review.authorPhone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                              </div>`;

code = code.replace(reviewsTarget, reviewsReplace);

fs.writeFileSync('src/App.tsx', code);
