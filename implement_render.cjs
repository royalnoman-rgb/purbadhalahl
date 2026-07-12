const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetListStart = `{/* Contacts List (Shown when searching or inside a category) */}
        {(selectedCategory || searchQuery) && !showCommunity && !showMap && (`;

const replaceListStart = `{/* Sub Categories Grid */}
        {selectedCategory && !searchQuery && !showCommunity && !showMap && !selectedSubCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {Object.keys(
              filteredContacts.reduce((acc, contact) => {
                const sub = contact.subCategory || 'অন্যান্য';
                if (!acc[sub]) acc[sub] = [];
                acc[sub].push(contact);
                return acc;
              }, {} as Record<string, typeof filteredContacts>)
            ).map((subCat) => {
               // Get icon from category if available, else fallback
               const IconComponent = selectedCategory?.iconName ? require('lucide-react')[selectedCategory.iconName] || require('lucide-react').Grid : require('lucide-react').Grid;
               return (
              <button
                key={subCat}
                onClick={() => setSelectedSubCategory(subCat)}
                className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none"
              >
                <div className={\`w-12 h-12 rounded-full flex items-center justify-center \${selectedCategory.color.split(' ')[0]} bg-opacity-10\`}>
                   <IconComponent className={\`w-6 h-6 \${selectedCategory.color.split(' ')[1]}\`} />
                </div>
                <span className="text-sm font-medium text-center text-gray-800">{subCat}</span>
              </button>
            )})}
          </div>
        )}

        {/* Contacts List (Shown when searching or inside a sub-category) */}
        {((selectedCategory && selectedSubCategory) || searchQuery) && !showCommunity && !showMap && (`;

if (code.includes(targetListStart)) {
  code = code.replace(targetListStart, replaceListStart);
  
  // also need to modify the Object.entries filter for contacts
  const targetReduceStart = `            {filteredContacts.length > 0 ? (
              Object.entries(
                filteredContacts.reduce((acc, contact) => {`;
                
  const replaceReduceStart = `            {filteredContacts.filter(c => !selectedSubCategory || (c.subCategory || 'অন্যান্য') === selectedSubCategory).length > 0 ? (
              Object.entries(
                filteredContacts.filter(c => !selectedSubCategory || (c.subCategory || 'অন্যান্য') === selectedSubCategory).reduce((acc, contact) => {`;
                
  code = code.replace(targetReduceStart, replaceReduceStart);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Updated Render Logic");
} else {
  console.log("Could not find target list start.");
}

