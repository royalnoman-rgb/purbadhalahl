const fs = require('fs');
const file = 'src/components/DataManagementTab.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  '<h2 className="text-xl font-bold">কন্টাক্ট মুভ করুন</h2>',
  `<div>
            <h2 className="text-xl font-bold">কন্টাক্ট ম্যানেজমেন্ট</h2>
            <p className="text-sm text-gray-500 mt-1">সর্বমোট কন্টাক্ট: <strong className="text-emerald-600">{toBengaliDigits(contacts.length)}</strong> | বর্তমানে দেখাচ্ছে: <strong className="text-blue-600">{toBengaliDigits(filteredContacts.length)}</strong></p>
          </div>`
);
content = content.replace(
  '<ArrowRight className="w-4 h-4" /> মুভ করুন ({selectedContacts.size})',
  '<ArrowRight className="w-4 h-4" /> মুভ করুন ({toBengaliDigits(selectedContacts.size)})'
);
content = content.replace(
  '<button \n            disabled={selectedContacts.size === 0}\n            onClick={() => setIsMoveModalOpen(true)}\n            className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"\n          >',
  `<div className="flex gap-2">
            <button 
              disabled={selectedContacts.size === 0}
              onClick={async () => {
                if (window.confirm(\`আপনি কি সত্যিই \${selectedContacts.size}টি কন্টাক্ট ডিলিট করতে চান?\`)) {
                  try {
                    const batch = writeBatch(db);
                    selectedContacts.forEach(id => {
                      if (!id.startsWith('static_')) {
                        batch.delete(doc(db, 'contacts', id));
                      }
                    });
                    await batch.commit();
                    setSelectedContacts(new Set());
                    alert('কন্টাক্ট ডিলিট সফল হয়েছে!');
                  } catch(e) {
                    alert('ডিলিট করতে সমস্যা হয়েছে।');
                  }
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> ডিলিট ({toBengaliDigits(selectedContacts.size)})
            </button>
            <button 
              disabled={selectedContacts.size === 0}
              onClick={() => setIsMoveModalOpen(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >`
);
content = content.replace(
  '</button>\n        </div>',
  '</button>\n          </div>\n        </div>'
);
fs.writeFileSync(file, content);
