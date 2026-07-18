import fs from 'fs';
let content = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

content = content.replace(/text-gray-500/g, 'text-slate-500');
content = content.replace(/text-gray-600/g, 'text-slate-600');

content = content.replace(
  'className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm relative overflow-hidden group"',
  'className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"'
);
content = content.replace(
  'className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm"',
  'className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100 shadow-sm hover:shadow-md transition-all"'
);

fs.writeFileSync('src/components/VisitorStats.tsx', content);
