import fs from 'fs';

function updateUI(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text colors and backgrounds to slate
  content = content.replace(/text-gray-500/g, 'text-slate-500');
  content = content.replace(/text-gray-600/g, 'text-slate-600');
  content = content.replace(/text-gray-700/g, 'text-slate-700');
  content = content.replace(/text-gray-800/g, 'text-slate-800');
  content = content.replace(/text-gray-900/g, 'text-slate-800');
  content = content.replace(/text-gray-400/g, 'text-slate-400');
  content = content.replace(/border-gray-100/g, 'border-slate-100');
  content = content.replace(/border-gray-200/g, 'border-slate-200');
  content = content.replace(/border-gray-300/g, 'border-slate-300');
  content = content.replace(/bg-gray-50/g, 'bg-slate-50');
  content = content.replace(/bg-gray-100/g, 'bg-slate-100');

  // Replace specific card classes
  content = content.replace(
    /className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100"/g,
    'className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100"'
  );
  content = content.replace(
    /className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4"/g,
    'className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 mb-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Enhanced ${filePath}`);
}

['src/TrainTracker.tsx', 'src/Community.tsx', 'src/MapComponent.tsx'].forEach(updateUI);

