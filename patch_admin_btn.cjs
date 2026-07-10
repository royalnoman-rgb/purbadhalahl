const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          {selectedCategory || showMap || showCommunity ? (`;

const replacement = `      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {selectedCategory || showMap || showCommunity ? (`;

const targetEnd = `              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : null}
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">পূর্বধলা স্মার্ট হেল্পলাইন</h1>
            <p className="text-emerald-100 text-xs mt-0.5">জরুরী প্রয়োজনে আপনার পাশে</p>
          </div>
          <button 
            onClick={() => setIsContributorProfileOpen(true)}
            className="p-2 hover:bg-emerald-700 active:bg-emerald-800 rounded-full transition-colors relative"
            aria-label="Contributor Profile"
          >`;

const replacementEnd = `              <ArrowLeft className="w-6 h-6" />
            </button>
            ) : null}
            <div>
              <h1 className="text-xl font-bold tracking-tight">পূর্বধলা স্মার্ট হেল্পলাইন</h1>
              <p className="text-emerald-100 text-xs mt-0.5">জরুরী প্রয়োজনে আপনার পাশে</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <a href="/admin" className="text-[10px] sm:text-xs bg-red-500 text-white px-2 py-1 rounded shadow-sm hover:bg-red-600 transition-colors font-medium">
                অ্যাডমিন প্যানেল
              </a>
            )}
            <button 
              onClick={() => setIsContributorProfileOpen(true)}
              className="p-2 hover:bg-emerald-700 active:bg-emerald-800 rounded-full transition-colors relative"
              aria-label="Contributor Profile"
            >`;

code = code.replace(target, replacement).replace(targetEnd, replacementEnd);

fs.writeFileSync(file, code);
