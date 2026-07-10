const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const adminFunctions = `
  const handleUpdatePointsApp = async (id: string, currentPoints: number) => {
    const newPoints = prompt('নতুন পয়েন্ট দিন:', currentPoints.toString());
    if (newPoints !== null && !isNaN(Number(newPoints))) {
      try {
        await updateDoc(doc(db, 'contributors', id), { points: Number(newPoints) });
        alert('পয়েন্ট আপডেট হয়েছে');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleBanContributorApp = async (id: string, isCurrentlyBanned: boolean) => {
    if (window.confirm(isCurrentlyBanned ? 'ব্যান তুলে নিতে চান?' : 'ইউজারকে ব্যান করতে চান?')) {
      try {
        await updateDoc(doc(db, 'contributors', id), { isBanned: !isCurrentlyBanned });
        alert(isCurrentlyBanned ? 'ব্যান তুলে নেওয়া হয়েছে' : 'ইউজার ব্যান করা হয়েছে');
      } catch (e) {
        console.error(e);
      }
    }
  };
`;

code = code.replace(
  `  const handleDeleteContactApp = async (id: string, e: React.MouseEvent) => {`,
  `${adminFunctions}\n  const handleDeleteContactApp = async (id: string, e: React.MouseEvent) => {`
);

const targetLeaderboard = `                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                          ) : (
                            <UserCircle className="w-8 h-8 text-emerald-600" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center text-sm">
                              {user.name}
                              {isVerifiedContributor(user.name) && <VerifiedBadge />}
                              {user.isBanned && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Banned</span>}
                            </p>
                            <p className="text-xs text-gray-500">{user.approvedCount || 0} টি নাম্বার যুক্ত করেছেন</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{user.points || ((user.approvedCount || 0) * 10)} <span className="text-xs font-normal text-gray-500">pt</span></p>
                      </div>
                    </div>`;

const replacementLeaderboard = `                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                          ) : (
                            <UserCircle className="w-8 h-8 text-emerald-600" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center text-sm">
                              {user.name}
                              {isVerifiedContributor(user.name) && <VerifiedBadge />}
                              {user.isBanned && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Banned</span>}
                            </p>
                            <p className="text-xs text-gray-500">{user.approvedCount || 0} টি নাম্বার যুক্ত করেছেন</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-emerald-600">{user.points || ((user.approvedCount || 0) * 10)} <span className="text-xs font-normal text-gray-500">pt</span></p>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => handleUpdatePointsApp(user.id, user.points || ((user.approvedCount || 0) * 10))}
                              className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium transition-colors"
                              title="পয়েন্ট এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleBanContributorApp(user.id, user.isBanned)}
                              className={\`p-1.5 rounded text-xs font-medium transition-colors \${user.isBanned ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-100 text-red-700 hover:bg-red-200'}\`}
                              title={user.isBanned ? "Unban" : "Ban"}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>`;

code = code.replace(targetLeaderboard, replacementLeaderboard);

fs.writeFileSync(file, code);
