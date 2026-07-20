const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);`;
const replState = `  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [showWelcomeNotice, setShowWelcomeNotice] = useState(false);`;

const targetEffect = `  useEffect(() => {
    // Fetch subcategories`;
const replEffect = `  useEffect(() => {
    // Check if they are already logged in
    if (!contributorPhone) {
      const hasSeen = safeStorage.getItem('hasSeenWelcomeNotice_v2');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowWelcomeNotice(true);
          safeStorage.setItem('hasSeenWelcomeNotice_v2', 'true');
        }, 1500); // show after 1.5 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [contributorPhone]);

  useEffect(() => {
    // Fetch subcategories`;

const targetActiveViews = `    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen,`;
const replActiveViews = `    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen, showWelcomeNotice,`;

const targetHandleBack = `    else if (isReviewsModalOpen) setIsReviewsModalOpen(false);`;
const replHandleBack = `    else if (showWelcomeNotice) setShowWelcomeNotice(false);
    else if (isReviewsModalOpen) setIsReviewsModalOpen(false);`;

const targetRender = `{/* Reviews Modal */}`;
const replRender = `{/* Welcome Notice Modal */}
      {showWelcomeNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowWelcomeNotice(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-center relative overflow-hidden">
              <div className="absolute -top-4 -right-4 p-3 opacity-20 pointer-events-none">
                <Star className="w-24 h-24 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 relative z-10">স্বাগতম!</h2>
              <p className="text-emerald-50 text-sm relative z-10">পূর্বধলা স্মার্ট হেল্পলাইন-এ আপনাকে স্বাগতম</p>
            </div>
            <div className="p-6 text-center relative">
              <div className="flex justify-center mb-4">
                 <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                   <Gift className="w-8 h-8" />
                 </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">একাউন্ট তৈরি করুন</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                সাইটে একটি একাউন্ট তৈরি করে রিওয়ার্ড পয়েন্ট অর্জন করুন! 
                ফেসবুক দিয়ে খুব সহজেই লগইন করতে পারবেন।
              </p>
              <div className="space-y-3">
                 <button 
                   onClick={() => {
                     setShowWelcomeNotice(false);
                     setIsContributorProfileOpen(true);
                   }} 
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm text-sm"
                 >
                   একাউন্ট তৈরি করুন
                 </button>
                 <button 
                   onClick={() => setShowWelcomeNotice(false)}
                   className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors text-sm"
                 >
                   পরে দেখবো
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}`;


if (appCode.includes(targetState)) {
  appCode = appCode.replace(targetState, replState);
} else {
  console.log('Failed to patch state');
}

if (appCode.includes(targetEffect)) {
  appCode = appCode.replace(targetEffect, replEffect);
} else {
  console.log('Failed to patch effect');
}

if (appCode.includes(targetActiveViews)) {
  appCode = appCode.replaceAll(targetActiveViews, replActiveViews);
} else {
  console.log('Failed to patch active views');
}

if (appCode.includes(targetHandleBack)) {
  appCode = appCode.replace(targetHandleBack, replHandleBack);
} else {
  console.log('Failed to patch handle back');
}

if (appCode.includes(targetRender)) {
  appCode = appCode.replace(targetRender, replRender);
} else {
  console.log('Failed to patch render');
}

fs.writeFileSync('src/App.tsx', appCode);
console.log('Successfully patched Welcome Notice Modal');
