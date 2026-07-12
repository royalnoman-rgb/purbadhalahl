const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `) : (
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
)`;

const replaceStr = `) : (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">সাব-ক্যাটাগরি *</label>
    <select required value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
      <option value="" disabled>সাব-ক্যাটাগরি নির্বাচন করুন</option>
      {Array.from(new Set([
        ...allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory),
        ...(predefinedSubCategories.find(pc => pc.categoryId === newCategory)?.subCategories || []),
        ...dynamicSubCategories.filter(sc => sc.categoryId === newCategory).map(sc => sc.title)
      ])).map(sub => (
         <option key={sub} value={sub}>{sub}</option>
      ))}
      {!Array.from(new Set([
        ...allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory),
        ...(predefinedSubCategories.find(pc => pc.categoryId === newCategory)?.subCategories || []),
        ...dynamicSubCategories.filter(sc => sc.categoryId === newCategory).map(sc => sc.title)
      ])).includes('অন্যান্য') && <option value="অন্যান্য">অন্যান্য</option>}
    </select>
  </div>
)`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  console.log("Successfully replaced App subcategory input with select dropdown");
} else {
  console.log("App.tsx target string not found!");
}

fs.writeFileSync('src/App.tsx', code);
