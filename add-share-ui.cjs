const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<button 
            onClick={() => setIsGuideOpen(true)}
            className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="ব্যবহারবিধি"
          >
            <HelpCircle className="w-6 h-6" />
          </button>`;

const replacement = `<button 
            onClick={handleShareApp}
            className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="শেয়ার করুন"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="ব্যবহারবিধি"
          >
            <HelpCircle className="w-6 h-6" />
          </button>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('UI replaced');
} else {
  console.log('Target not found');
}
