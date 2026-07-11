const fs = require('fs');
let code = fs.readFileSync('src/UserProfileModal.tsx', 'utf8');

code = code.replace(
  "currentUserAvatar: string;",
  "currentUserAvatar: string;\n  onlineUsers: string[];"
);

code = code.replace(
  "currentUserAvatar }: UserProfileModalProps) {",
  "currentUserAvatar, onlineUsers }: UserProfileModalProps) {"
);

const target = `              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-sm mb-4" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  <UserCircle className="w-12 h-12" />
                </div>
              )}`;

const replace = `              <div className="relative mb-4">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm">
                    <UserCircle className="w-12 h-12" />
                  </div>
                )}
                {onlineUsers.includes(userPhone) && <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>}
              </div>`;

code = code.replace(target, replace);
fs.writeFileSync('src/UserProfileModal.tsx', code);
