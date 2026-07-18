import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldGrid = `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowCommunity(true)}
              className="bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Users className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">কমিউনিটি</span>
            </button>
            <button
              onClick={() => setShowMap(true)}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">গাড়ির অবস্থান</span>
            </button>
            <button
              onClick={() => setShowTrainTracker(true)}
              className="bg-orange-50 text-orange-700 border border-orange-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
              <Train className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">ট্রেন ট্র্যাকিং</span>
            </button>
            <button
              onClick={() => setIsReviewsModalOpen(true)}
              className="bg-purple-50 text-purple-700 border border-purple-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <Star className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">রেটিংস ও রিভিও</span>
            </button>`;

const newGrid = `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setShowCommunity(true)}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-300 overflow-hidden relative group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block mb-0.5">কমিউনিটি ফোরাম</span>
                    <span className="text-xs text-blue-100 font-medium">সবার সাথে যুক্ত হোন</span>
                  </div>
                </div>
                <div className="relative z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                {/* Decorative background shapes */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-blue-400/30 rounded-full blur-lg"></div>
              </button>
              
              <button
                onClick={() => setIsReviewsModalOpen(true)}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden relative group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Star className="w-6 h-6 text-white fill-white/20" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block mb-0.5">রেটিংস ও রিভিও</span>
                    <span className="text-xs text-purple-100 font-medium">মতামত জানুন ও দিন</span>
                  </div>
                </div>
                <div className="relative z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                {/* Decorative background shapes */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-purple-400/30 rounded-full blur-lg"></div>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setShowMap(true)}
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
              >
                <Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />
                <span className="text-sm sm:text-base font-medium text-center">গাড়ির অবস্থান</span>
              </button>
              <button
                onClick={() => setShowTrainTracker(true)}
                className="bg-orange-50 text-orange-700 border border-orange-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
              >
                <Train className="w-10 h-10 mb-1" strokeWidth={1.5} />
                <span className="text-sm sm:text-base font-medium text-center">ট্রেন ট্র্যাকিং</span>
              </button>`;

if (content.includes(oldGrid)) {
  content = content.replace(oldGrid, newGrid);
  if (!content.includes('ArrowRight')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, ArrowRight} from 'lucide-react';");
  }
  content = content.replace(
    /\{allCategories\.map\(\(category, index\) => \{\n\s+const IconComponent = iconMap\[category\.iconName\] \|\| Building2;\n\s+return \(\n\s+<div key=\{category\.id\} className="relative group">\n\s+<button/g,
    `{allCategories.map((category, index) => {
              const IconComponent = iconMap[category.iconName] || Building2;
              return (
                <div key={category.id} className="relative group">
                  <button`
  );
  // Need to make sure we close the <> with </>
  content = content.replace(
    /<\/div>\n\s+\)\}\n\s+<\/div>\n\s+<\/div>/g,
    `</div>\n        )}\n          </>\n        )}`
  );
  // But wait, regex replace is risky for closing tag if there are multiple matches or incorrect structure.
  // Instead, let's just do a manual replace of the exact ending.
} else {
  console.log("Could not find old grid");
}

fs.writeFileSync('src/App.tsx', content);
