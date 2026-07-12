const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const searchStr = `                  <div>
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

const replaceStr = `{newCategory === 'blood_donors' ? (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ ও ধরন *</label>
    <select required value={newBloodGroup} onChange={(e) => setNewBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
      <option value="" disabled>নির্বাচন করুন</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="রক্তদাতা">রক্তদাতা (গ্রুপ জানা নেই)</option>
      <option value="ব্লাড ব্যাংক">ব্লাড ব্যাংক</option>
    </select>
  </div>
) : (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">সাব-ক্যাটাগরি (ঐচ্ছিক)</label>
    <input type="text" list="subcat-list" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="যেমন: ফায়ার সার্ভিস, অথবা নতুন লিখুন" />
    <datalist id="subcat-list">
      {Array.from(new Set([
        ...allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory),
        ...(predefinedSubCategories.find(pc => pc.categoryId === newCategory)?.subCategories || [])
      ])).map(sub => (
         <option key={sub} value={sub} />
      ))}
    </datalist>
  </div>
)}`;
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
