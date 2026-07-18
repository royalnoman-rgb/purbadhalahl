import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Header
content = content.replace(
  'className="bg-emerald-600 text-white shadow-md sticky top-0 z-10 transition-all"',
  'className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg sticky top-0 z-40 transition-all border-b border-emerald-500/20"'
);

// 2. Search Wrapper
content = content.replace(
  'className="w-full pl-10 pr-12 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-inner"',
  'className="w-full pl-12 pr-12 py-3.5 rounded-full text-slate-800 bg-white/95 backdrop-blur-md border-0 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-[0_2px_12px_rgba(0,0,0,0.1)] transition-all placeholder-slate-500 font-medium font-sans"'
);
content = content.replace(
  '<Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />',
  '<Search className="absolute left-4 top-3.5 text-emerald-600/70 w-5 h-5" />'
);
content = content.replace(
  'className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"',
  'className="absolute right-3 top-2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"'
);

// 3. Category Grids (Top highlights)
content = content.replace(
  'className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-300 overflow-hidden relative group"',
  'className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-300 overflow-hidden relative group"'
);
content = content.replace(
  'className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden relative group"',
  'className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_14px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden relative group"'
);

// Map/Train
content = content.replace(
  'className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"',
  'className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 group"'
);
content = content.replace(
  'className="bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"',
  'className="bg-blue-50 text-blue-700 border border-blue-100/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 group"'
);

// 4. allCategories loop
content = content.replace(
  'className={`${category.color} w-full h-full rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50`}',
  'className={`${category.color} w-full h-full rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-transparent hover:border-black/5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 group`}'
);
// Make all category icons scale on hover
content = content.replace(
  '<IconComponent className="w-10 h-10 mb-1" strokeWidth={1.5} />',
  '<IconComponent className="w-10 h-10 mb-1 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />'
);
content = content.replace(
  '<Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />',
  '<Navigation className="w-10 h-10 mb-1 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />'
);
content = content.replace(
  '<Train className="w-10 h-10 mb-1" strokeWidth={1.5} />',
  '<Train className="w-10 h-10 mb-1 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />'
);


// 5. Contact Cards
// Note: We need a regex since there are multiple contact card renders.
content = content.replace(
  /className="bg-white rounded-lg p-2\.5 sm:p-3 shadow-sm border border-gray-100 flex items-center justify-between gap-3 hover:shadow-md transition-shadow group"/g,
  'className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between gap-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"'
);
content = content.replace(
  /className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1"/g,
  'className="font-semibold text-slate-800 text-base line-clamp-1"'
);
content = content.replace(
  /className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-0\.5"/g,
  'className="text-sm text-slate-500 line-clamp-1 mt-0.5"'
);
content = content.replace(
  /className="text-xs text-gray-400 mt-0\.5 line-clamp-1"/g,
  'className="text-xs text-slate-400 mt-1 line-clamp-1"'
);

// Buttons in contact cards
content = content.replace(
  /className="p-2 sm:p-2\.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors shrink-0"/g,
  'className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 hover:text-emerald-700 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 shadow-sm"'
);
content = content.replace(
  /className="p-2 sm:p-2\.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors shrink-0"/g,
  'className="p-3 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 hover:text-teal-700 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 shadow-sm"'
);

// 6. Main background and text
content = content.replace(
  /className="min-h-screen bg-gray-50 text-gray-900 pb-20 sm:pb-8"/g,
  'className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-8 selection:bg-emerald-200 selection:text-emerald-900"'
);

// 7. Modals
content = content.replace(
  /className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"/g,
  'className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-md transition-all"'
);
content = content.replace(
  /className="bg-white rounded-2xl w-full max-w-md max-h-\[90vh\] overflow-y-auto relative"/g,
  'className="bg-white rounded-[1.5rem] w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl ring-1 ring-slate-900/5"'
);
content = content.replace(
  /className="bg-white rounded-2xl w-full max-w-lg max-h-\[90vh\] overflow-y-auto relative"/g,
  'className="bg-white rounded-[1.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl ring-1 ring-slate-900/5"'
);


// 8. Add / Request Buttons
content = content.replace(
  /className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-emerald-700 transition-colors shadow-sm active:scale-\[0\.98\]"/g,
  'className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-medium shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"'
);

// Replace generic "text-gray-XXX" to "text-slate-XXX" for softer more modern look
content = content.replace(/text-gray-500/g, 'text-slate-500');
content = content.replace(/text-gray-600/g, 'text-slate-600');
content = content.replace(/text-gray-700/g, 'text-slate-700');
content = content.replace(/text-gray-900/g, 'text-slate-800'); // Note: 900 -> 800 for less harsh black
content = content.replace(/text-gray-400/g, 'text-slate-400');
content = content.replace(/border-gray-100/g, 'border-slate-100');
content = content.replace(/border-gray-200/g, 'border-slate-200');
content = content.replace(/border-gray-300/g, 'border-slate-300');
content = content.replace(/bg-gray-50/g, 'bg-slate-50');
content = content.replace(/bg-gray-100/g, 'bg-slate-100');

fs.writeFileSync('src/App.tsx', content);

console.log("UI enhancements applied.");
