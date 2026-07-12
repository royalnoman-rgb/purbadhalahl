const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update resets
code = code.replace(
  "setNewCategory(contact.categoryId);",
  "setNewCategory(contact.categoryId);\n    setNewSubCategory(contact.subCategory || '');"
);

code = code.replace(
  "setNewCategory('');\n    setEditingContactId(null);\n    setIsRequestModalOpen(true);",
  "setNewCategory('');\n    setNewSubCategory('');\n    setEditingContactId(null);\n    setIsRequestModalOpen(true);"
);

code = code.replace(
  "setNewCategory('');\n        setEditingContactId(null);\n      }, 2000);",
  "setNewCategory('');\n        setNewSubCategory('');\n        setEditingContactId(null);\n      }, 2000);"
);

// Add the sub-category input right after category select
const targetInputStr = `                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি *</label>
                    <select
                      required value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>`;

const replaceInputStr = `                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি *</label>
                    <select
                      required value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সাব-ক্যাটাগরি (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      list="subcat-list"
                      value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="যেমন: ফায়ার সার্ভিস, অথবা নতুন লিখুন"
                    />
                    <datalist id="subcat-list">
                      {Array.from(new Set(allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory))).map(sub => (
                         <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </div>`;

code = code.replace(targetInputStr, replaceInputStr);

fs.writeFileSync('src/App.tsx', code);
