const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStr = `        {/* Sub Categories Grid */}
        {selectedCategory && !searchQuery && !showCommunity && !showMap && !selectedSubCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {Array.from(new Set([
              ...filteredContacts.reduce((acc, contact) => {
                const sub = contact.subCategory || 'অন্যান্য';
                acc.push(sub);
                return acc;
              }, [] as string[]),
              ...dynamicSubCategories.filter(sc => sc.categoryId === selectedCategory.id && sc.status === 'approved').map(sc => sc.title),
              ...(predefinedSubCategories.find(pc => pc.categoryId === selectedCategory.id)?.subCategories || [])
            ])).map((subCat) => {`;

const replaceStr = `        {/* Sub Categories Grid */}
        {selectedCategory && !searchQuery && !showCommunity && !showMap && !selectedSubCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {(() => {
              const rawSubCats = Array.from(new Set([
                ...filteredContacts.reduce((acc, contact) => {
                  const sub = contact.subCategory || 'অন্যান্য';
                  acc.push(sub);
                  return acc;
                }, [] as string[]),
                ...dynamicSubCategories.filter(sc => sc.categoryId === selectedCategory.id && sc.status === 'approved').map(sc => sc.title),
                ...(predefinedSubCategories.find(pc => pc.categoryId === selectedCategory.id)?.subCategories || [])
              ])).filter(subCat => !(selectedCategory.deletedSubCategories || []).includes(subCat));
          
              const orderMap = new Map((selectedCategory.subCategoriesOrder || []).map((name, i) => [name, i]));
              const sortedSubCats = rawSubCats.sort((a, b) => {
                const indexA = orderMap.has(a) ? orderMap.get(a) : 999;
                const indexB = orderMap.has(b) ? orderMap.get(b) : 999;
                return indexA - indexB;
              });
              
              return sortedSubCats.map((subCat, index) => {`;

const searchStr2 = `               return (
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
        )}`;

const replaceStr2 = `               return (
              <div key={subCat} className="relative group">
              {editingSubCatIdFront === subCat ? (
                 <div className="bg-white border border-gray-100 w-full rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm">
                   <input type="text" value={editSubCatTitleFront} onChange={e => setEditSubCatTitleFront(e.target.value)} className="w-full text-center text-sm border p-1 rounded" autoFocus />
                   <div className="flex gap-2 w-full mt-1">
                     <button onClick={(e) => handleRenameSubCategoryFront(subCat, e)} className="flex-1 bg-emerald-600 text-white text-xs py-1.5 rounded">সেভ</button>
                     <button onClick={() => setEditingSubCatIdFront(null)} className="flex-1 bg-gray-200 text-gray-700 text-xs py-1.5 rounded">বাতিল</button>
                   </div>
                 </div>
              ) : (
                <button
                  onClick={() => setSelectedSubCategory(subCat)}
                  className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none"
                >
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center \${selectedCategory.color.split(' ')[0]} bg-opacity-10\`}> 
                    <IconComponent className={\`w-6 h-6 \${selectedCategory.color.split(' ')[1]}\`} />
                  </div>
                  <span className="text-sm font-medium text-center text-gray-800">{subCat}</span>
                  
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                       <div className="flex gap-1">
                         <button onClick={(e) => handleMoveSubCategoryFront(subCat, 'up', sortedSubCats, e)} disabled={index === 0} className="bg-gray-100 p-1 rounded hover:bg-emerald-100 text-gray-500 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                         <button onClick={(e) => handleMoveSubCategoryFront(subCat, 'down', sortedSubCats, e)} disabled={index === sortedSubCats.length - 1} className="bg-gray-100 p-1 rounded hover:bg-emerald-100 text-gray-500 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                       </div>
                       <div className="flex gap-1 mt-1 justify-end">
                         <button onClick={(e) => { e.stopPropagation(); setEditingSubCatIdFront(subCat); setEditSubCatTitleFront(subCat); }} className="bg-blue-50 p-1 rounded hover:bg-blue-100 text-blue-600"><Edit3 className="w-3 h-3" /></button>
                         <button onClick={(e) => handleDeleteSubCategoryFront(subCat, e)} className="bg-red-50 p-1 rounded hover:bg-red-100 text-red-600"><Trash2 className="w-3 h-3" /></button>
                       </div>
                    </div>
                  )}
                </button>
              )}
              </div>
            );
            })})()}
          </div>
        )}`;

if (code.includes(searchStr) && code.includes(searchStr2)) {
  code = code.replace(searchStr, replaceStr);
  code = code.replace(searchStr2, replaceStr2);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success replacing subcat grid");
} else {
  console.log("Failed to find strings to replace.");
}
