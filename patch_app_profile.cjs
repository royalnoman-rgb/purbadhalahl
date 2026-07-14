const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Pass isBloodDonor to UserProfileModal
content = content.replace(
  `<UserProfileModal isOpen={!!selectedUserProfile} onClose={() => setSelectedUserProfile(null)} userPhone={selectedUserProfile || ""} currentUserId={contributorPhone} currentUserName={contributorName} currentUserAvatar={contributorAvatar} onlineUsers={onlineUsers} />`,
  `<UserProfileModal isOpen={!!selectedUserProfile} onClose={() => setSelectedUserProfile(null)} userPhone={selectedUserProfile || ""} currentUserId={contributorPhone} currentUserName={contributorName} currentUserAvatar={contributorAvatar} onlineUsers={onlineUsers} isBloodDonor={allContacts.some(c => c.categoryId === 'blood_donors' && c.phone === selectedUserProfile && c.status === 'approved' && c.subCategory !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন')} />`
);

// Show badge in active user profile view
const myProfileTarget = `                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {contributorName}
                    {isVerifiedContributor(contributorName) && <VerifiedBadge />}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{toBengaliDigits(contributorPhone)}</p>`;

const myProfileReplacement = `                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {contributorName}
                        {isVerifiedContributor(contributorName) && <VerifiedBadge />}
                      </h2>
                    </div>
                    {allContacts.some(c => c.categoryId === 'blood_donors' && c.phone === contributorPhone && c.status === 'approved' && c.subCategory !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন') && (
                      <span className="mt-1 text-[11px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                        রক্তদাতা
                      </span>
                    )}
                    <p className="text-gray-500 text-sm mt-1">{toBengaliDigits(contributorPhone)}</p>
                  </div>`;

content = content.replace(myProfileTarget, myProfileReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx for profile badges");
