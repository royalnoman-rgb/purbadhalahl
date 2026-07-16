const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  ` <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsEditProfileMode(true)} className="text-sm text-emerald-600 hover:underline font-medium">
                      প্রোফাইল আপডেট করুন
                    </button>`,
  ` {(safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin' || isAdmin) && (
                      <div className="mb-4">
                        <button
                          type="button"
                          onClick={() => {
                            safeStorage.setItem('adminAuth', safeStorage.getItem('contributorRole') || 'true');
                            window.location.href = '/admin';
                          }}
                          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          অ্যাডমিন প্যানেল (কন্ট্রোল রুম)
                        </button>
                      </div>
                    )}
 <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsEditProfileMode(true)} className="text-sm text-emerald-600 hover:underline font-medium">
                      প্রোফাইল আপডেট করুন
                    </button>`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched admin button");
