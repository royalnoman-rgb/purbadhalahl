const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const s1 = code.indexOf('{/* Sub Categories Grid */}');
const s2 = code.indexOf('{/* Contacts List (Shown when searching or inside a sub-category) */}');

const pre = code.substring(0, s1);
const post = code.substring(s2);

const replacement = `{/* Sub Categories Grid */}
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
              
              return sortedSubCats.map((subCat, index) => {
               // Get icon from category if available, else fallback
               let IconComponent = selectedCategory?.iconName ? (iconMap[selectedCategory.iconName] || Building2) : Building2;
               
               if (subCat === 'হাসপাতাল/ক্লিনিক') IconComponent = Activity;
               else if (subCat === 'ডাক্তার') IconComponent = Stethoscope;
               else if (subCat === 'ডায়াগনস্টিক সেন্টার') IconComponent = Microscope;
               else if (subCat === 'ফার্মেসি') IconComponent = Pill;
               else if (subCat === 'সংসদ সদস্য (এমপি)') IconComponent = UserCheck;
               else if (subCat === 'উপজেলা পরিষদ') IconComponent = Landmark;
               else if (subCat === 'ইউনিয়ন পরিষদ') IconComponent = Home;
               else if (subCat === 'স্কুল/কলেজ/মাদ্রাসা') IconComponent = School;
               else if (subCat === 'কিন্ডারগার্টেন') IconComponent = Baby;
               else if (subCat === 'প্রাইভেট টিউটর') IconComponent = BookOpen;
               else if (subCat === 'বাস') IconComponent = Bus;
               else if (subCat === 'ট্রেন') IconComponent = Train;
               else if (subCat === 'রেন্ট-এ-কার') IconComponent = Car;
               else if (subCat === 'সিএনজি/অটো স্ট্যান্ড') IconComponent = CarTaxiFront;
               else if (subCat === 'ট্রাক/পিকআপ') IconComponent = Truck;
               else if (subCat === 'ইলেকট্রিশিয়ান') IconComponent = Zap;
               else if (subCat === 'প্লাম্বার') IconComponent = Droplets;
               else if (subCat === 'টিভি/ফ্রিজ মেকানিক') IconComponent = Tv;
               else if (subCat === 'রাজমিস্ত্রি/কাঠমিস্ত্রি') IconComponent = Hammer;
               else if (subCat === 'আইনজীবী') IconComponent = Scale;
               else if (subCat === 'গ্যাস সিলিন্ডার') IconComponent = Flame;
               else if (subCat === 'রেস্টুরেন্ট/খাবার দোকান') IconComponent = Utensils;
               else if (subCat === 'কম্পিউটার/ইন্টারনেট/ওয়াইফাই') IconComponent = Wifi;
               else if (subCat === 'হার্ডওয়্যার/ডেকোরেটর') IconComponent = Wrench;
               else if (subCat === 'মুদি দোকান/সুপার শপ') IconComponent = ShoppingCart;
               else if (subCat === 'ব্যাংক') IconComponent = Landmark;
               else if (subCat === 'এনজিও') IconComponent = Users;
               else if (subCat === 'মোবাইল ব্যাংকিং এজেন্ট') IconComponent = Smartphone;
               else if (subCat === 'কাজী অফিস') IconComponent = HeartHandshake;
               else if (subCat === 'মসজিদ/মন্দির') IconComponent = MoonStar;
               else if (subCat === 'স্বেচ্ছাসেবী সংগঠন') IconComponent = Heart;
               else if (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'].includes(subCat)) IconComponent = Droplets;

               return (
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
        )}
        `;

fs.writeFileSync('src/App.tsx', pre + replacement + post);
console.log('Success chunking!');
