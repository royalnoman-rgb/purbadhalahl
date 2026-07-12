const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('selectedSubCategory')) {
  // Add state
  code = code.replace(
    'const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);',
    'const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);\n  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);'
  );

  // Modify back button
  code = code.replace(
    'onClick={() => { setSelectedCategory(null); setShowMap(false); setShowCommunity(false); }}',
    `onClick={() => {
                if (selectedSubCategory) {
                  setSelectedSubCategory(null);
                } else {
                  setSelectedCategory(null);
                  setShowMap(false);
                  setShowCommunity(false);
                }
              }}`
  );

  // We should also reset selectedSubCategory when category is selected
  // Not directly needed because selectedCategory clicking triggers onClick={() => setSelectedCategory(category)}
  // Let's replace `setSelectedCategory(category)` with `setSelectedCategory(category); setSelectedSubCategory(null);`
  // Actually, we can just replace all exact matches of `setSelectedCategory(category)`
  code = code.replace(
    /setSelectedCategory\(category\)/g,
    'setSelectedCategory(category); setSelectedSubCategory(null);'
  );
  
  // same for setSelectedCategory(null) ? 
  // The back button handles it.

  // The actual render logic.
  const oldRenderStr = `{/* Contacts List (Shown when searching or inside a category) */}
        {(selectedCategory || searchQuery) && !showCommunity && !showMap && (
          <div className="space-y-6">
            {filteredContacts.length > 0 ? (
              Object.entries(
                filteredContacts.reduce((acc, contact) => {
                  const sub = contact.subCategory || (selectedCategory ? 'অন্যান্য' : 'ফলাফল');
                  if (!acc[sub]) acc[sub] = [];
                  acc[sub].push(contact);
                  return acc;
                }, {} as Record<string, typeof filteredContacts>)
              ).map(([subCat, contacts]) => (
                <div key={subCat} className="space-y-3">
                  {subCat !== 'ফলাফল' && <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">{subCat}</h3>}
                  {contacts.map((contact, index) => (
                    <div key={contact.id || contact.phone} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group">`;

  // We need to match this block and replace it. But I see in the previous steps it might be slightly different.
  // Let's write a targeted script to extract and replace the render logic.
  fs.writeFileSync('src/App.tsx', code);
  console.log("State and back button updated.");
} else {
  console.log("State already present");
}
