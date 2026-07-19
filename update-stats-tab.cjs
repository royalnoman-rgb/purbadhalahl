const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                  {activeUserTab === 'stats' && (
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
                    <h3 className="font-semibold text-emerald-800 text-lg mb-3">আপনার ড্যাশবোর্ড</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-slate-500 mb-1">এপ্রুভড নাম্বার</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorApprovedCount}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-slate-500 mb-1">মোট পয়েন্ট</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorPoints}</p>
                      </div>
                    </div>
                  </div>
                  )}`;

const replacement = `                  {activeUserTab === 'stats' && (
                    <>
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
                    <h3 className="font-semibold text-emerald-800 text-lg mb-3">আপনার ড্যাশবোর্ড</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-slate-500 mb-1">এপ্রুভড নাম্বার</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorApprovedCount}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-slate-500 mb-1">মোট পয়েন্ট</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorPoints}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">ইনভাইট করুন ও পয়েন্ট জিতুন</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">আপনার বন্ধুদের সাথে অ্যাপটি শেয়ার করুন। আপনার লিংকে ক্লিক করে কেউ নতুন একাউন্ট খুললেই আপনি পাবেন <span className="font-bold">১০ পয়েন্ট</span>!</p>
                    <button 
                      onClick={handleShareApp}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      লিংক শেয়ার করুন
                    </button>
                  </div>
                  </>
                  )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Stats tab updated');
} else {
  console.log('Target not found in App.tsx');
}
