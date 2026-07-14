const fs = require('fs');
let content = fs.readFileSync('src/UserProfileModal.tsx', 'utf8');

content = content.replace(
  `  onlineUsers: string[];`,
  `  onlineUsers: string[];
  isBloodDonor?: boolean;`
);

content = content.replace(
  `export default function UserProfileModal({ isOpen, onClose, userPhone, currentUserId, currentUserName, currentUserAvatar, onlineUsers }: UserProfileModalProps) {`,
  `export default function UserProfileModal({ isOpen, onClose, userPhone, currentUserId, currentUserName, currentUserAvatar, onlineUsers, isBloodDonor }: UserProfileModalProps) {`
);

content = content.replace(
  `              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                {userData.name}
              </h3>`,
  `              <div className="flex flex-col items-center mb-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {userData.name}
                </h3>
                {isBloodDonor && (
                  <span className="mt-1 text-[11px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                    রক্তদাতা
                  </span>
                )}
              </div>`
);

fs.writeFileSync('src/UserProfileModal.tsx', content);
console.log("Patched UserProfileModal.tsx");
