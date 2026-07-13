const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `<h2 className="text-lg font-semibold mb-4 border-b pb-2">অবদানকারীগণ (Contributors) - {contributors.length}</h2>`;
  const replacement = `<div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">অবদানকারীগণ (Contributors) - {contributors.length}</h2>
            <button onClick={() => setShowBroadcastModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
              <Send className="w-4 h-4" /> সকলকে নোটিশ দিন
            </button>
          </div>`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched UI 1 in ' + file);
  } else {
    console.log('Target UI 1 not found in ' + file);
  }

  const modalTarget = `      <ConfirmDialog `;
  const modalReplacement = `      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" /> সকল ইউজারকে নোটিশ দিন
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">নোটিশের টাইটেল</label>
                <input type="text" value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="যেমন: নতুন আপডেট" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত ম্যাসেজ</label>
                <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 min-h-[100px]" placeholder="ম্যাসেজ লিখুন..." />
              </div>
              <button onClick={handleBroadcast} disabled={broadcasting || !broadcastTitle.trim() || !broadcastMessage.trim()} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex justify-center items-center gap-2">
                {broadcasting ? 'পাঠানো হচ্ছে...' : <><Send className="w-4 h-4" /> নোটিশ পাঠান</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog `;

  if (content.includes(modalTarget)) {
    content = content.replace(modalTarget, modalReplacement);
    fs.writeFileSync(file, content);
    console.log('Patched UI 2 in ' + file);
  } else {
    console.log('Target UI 2 not found in ' + file);
  }
}

patchFile('src/Admin.tsx');
