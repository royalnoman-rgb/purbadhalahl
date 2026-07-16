const fs = require('fs');

let adminContent = fs.readFileSync('src/Admin.tsx', 'utf8');

adminContent = adminContent.replace(
  `<button onClick={() => setActiveTab('inbox')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors relative \${activeTab === 'inbox' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
  ইনবক্স
  {contributors.some(c => c.hasUnreadAdminMessage) && (
    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
  )}
</button>`,
  `{isSuperAdmin && (
            <button onClick={() => setActiveTab('inbox')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors relative \${activeTab === 'inbox' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
              ইনবক্স
              {contributors.some(c => c.hasUnreadAdminMessage) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          )}`
);

adminContent = adminContent.replace(
  `<button onClick={() => setActiveTab('feedbacks')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            মতামত ({feedbacks.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিভিউ ({publicReviews.length})
          </button>
          <button onClick={() => setActiveTab('contributors')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'contributors' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অবদানকারী
          </button>
          <button onClick={() => setActiveTab('history')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অ্যাডমিন হিস্ট্রি
          </button>
          <button onClick={() => setActiveTab('recycle')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিসাইকেল বিন ({deletedPosts.length})
          </button>`,
  `{isSuperAdmin && (
            <>
              <button onClick={() => setActiveTab('feedbacks')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                মতামত ({feedbacks.length})
              </button>
              <button onClick={() => setActiveTab('reviews')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                রিভিউ ({publicReviews.length})
              </button>
              <button onClick={() => setActiveTab('contributors')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'contributors' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                অবদানকারী
              </button>
              <button onClick={() => setActiveTab('history')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                অ্যাডমিন হিস্ট্রি
              </button>
              <button onClick={() => setActiveTab('recycle')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                রিসাইকেল বিন ({deletedPosts.length})
              </button>
            </>
          )}`
);

fs.writeFileSync('src/Admin.tsx', adminContent);

console.log("Patched admin tabs");
