const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
`  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);`,
`  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isFabExpanded, setIsFabExpanded] = useState(false);`
);

content = content.replace(
`      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
        <button
          onClick={() => setIsSubCategoryModalOpen(true)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new sub-category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন সাব-ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>
        <button
          onClick={openNewRequestModal}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Request to add number"
        >
          <span className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন নাম্বার যুক্ত করুন</span>
          <UserPlus className="w-6 h-6" />
        </button>
      </div>`,
`      {/* Floating Action Buttons */}
      <div 
        className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-20"
        onMouseEnter={() => setIsFabExpanded(true)}
        onMouseLeave={() => setIsFabExpanded(false)}
      >
        {isFabExpanded && (
          <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button
              onClick={() => { setIsSubCategoryModalOpen(true); setIsFabExpanded(false); }}
              className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center group relative"
              aria-label="Add new sub-category"
            >
              <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন সাব-ক্যাটাগরি যুক্ত করুন</span>
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsCategoryModalOpen(true); setIsFabExpanded(false); }}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center group relative"
              aria-label="Add new category"
            >
              <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন ক্যাটাগরি যুক্ত করুন</span>
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => { openNewRequestModal(); setIsFabExpanded(false); }}
              className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center group relative"
              aria-label="Request to add number"
            >
              <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন নাম্বার যুক্ত করুন</span>
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsFabExpanded(!isFabExpanded)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          aria-label="Options"
        >
          <div className={\`transition-transform duration-300 \${isFabExpanded ? 'rotate-45' : 'rotate-0'}\`}>
            <Plus className="w-6 h-6" />
          </div>
        </button>
      </div>`
);

fs.writeFileSync('src/App.tsx', content);
