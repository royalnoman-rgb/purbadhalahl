const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetHeader = `<button 
            onClick={() => setIsContributorProfileOpen(true)}
            className="ml-1 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white relative"`;

const replacementHeader = `<div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  // mark all as read
                  const unreadNotifs = notifications.filter(n => !n.read);
                  unreadNotifs.forEach(n => {
                    updateDoc(doc(db, 'notifications', n.id), { read: true }).catch(() => {});
                  });
                  prevNotifCount.current = 0;
                }
              }}
              className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white relative"
              title="নোটিফিকেশন"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">নোটিফিকেশন</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => {
                        notifications.forEach(n => {
                          deleteDoc(doc(db, 'notifications', n.id)).catch(() => {});
                        });
                        setNotifications([]);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">কোনো নোটিফিকেশন নেই।</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={\`p-3 border-b border-gray-50 text-sm hover:bg-gray-50 cursor-pointer transition-colors \${!notif.read ? 'bg-blue-50/30' : ''}\`}
                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link === 'community') {
                            setShowCommunity(true);
                            setShowMap(false);
                            setSelectedCategory(null);
                          } else if (notif.link === 'messages') {
                            if (isAdmin) {
                                // admin inbox handled differently, but we can't easily redirect to admin dashboard from app unless window.location
                                window.location.href = '/admin';
                            } else {
                                setIsContributorProfileOpen(true);
                                // could set tab, but it defaults to stats, would be nice to open inbox. Just open profile for now
                            }
                          }
                        }}
                      >
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">{notif.title}</h4>
                        <p className="text-gray-600 text-[11px] line-clamp-2">{notif.body}</p>
                        <span className="text-[9px] text-gray-400 mt-1 block">{new Date(notif.createdAt).toLocaleString('bn-BD')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsContributorProfileOpen(true)}
            className="ml-1 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white relative"`;

code = code.replace(targetHeader, replacementHeader);
fs.writeFileSync('src/App.tsx', code);
