const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `{/* Contacts List (Shown when searching or inside a category) */}
        {(selectedCategory || searchQuery) && !showCommunity && !showMap && (
          <div className="space-y-3">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => (
                <div key={contact.id || contact.phone} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group">`;

const replacementStr = `{/* Contacts List (Shown when searching or inside a category) */}
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

if (code.includes('filteredContacts.map((contact, index) => (')) {
  code = code.replace(targetStr, replacementStr);
  
  // also need to close the map and Object.entries
  const targetEnd = `                  </div>
                </div>
              ))
            ) : (`;
  
  const replacementEnd = `                  </div>
                </div>
              )))
            )) : (`;
            
  // Let's use regex to find the end properly.
  code = code.replace(/<\/button>\n\s*\{\/\* Delete button \*\/\}/g, `</button>\n                      {/* Delete button */}`);
}

fs.writeFileSync('src/App.tsx', code);
