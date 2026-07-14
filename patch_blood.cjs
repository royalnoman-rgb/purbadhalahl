const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const subCatGrid = `        {selectedCategory && !searchQuery && !showCommunity && !showMap && !selectedSubCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {(() => {
              if (selectedCategory.id === 'blood_donors') {
                const subCat1 = 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন';
                const subCat2 = 'রক্তদাতা';
                
                const count1 = filteredContacts.filter(c => c.subCategory === subCat1).length;
                const count2 = filteredContacts.filter(c => ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা (গ্রুপ জানা নেই)', 'ব্লাড ব্যাংক'].includes(c.subCategory || '')).length;

                return (
                  <>
                    <div onClick={() => setSelectedSubCategory(subCat1)} className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none cursor-pointer">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                         <Users className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-center text-gray-800">{subCat1}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{toBengaliDigits(count1.toString())} টি নাম্বার</span>
                      </div>
                    </div>
                    <div onClick={() => setSelectedSubCategory(subCat2)} className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none cursor-pointer">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                         <Droplets className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-center text-gray-800">{subCat2}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{toBengaliDigits(count2.toString())} টি নাম্বার</span>
                      </div>
                    </div>
                  </>
                );
              }

              const rawSubCats = Array.from(new Set([`;

content = content.replace(`        {selectedCategory && !searchQuery && !showCommunity && !showMap && !selectedSubCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {(() => {
              const rawSubCats = Array.from(new Set([`, subCatGrid);

// Now for selectedSubCategory === 'রক্তদাতা'
const bloodGroupGrid = `        {selectedCategory && selectedCategory.id === 'blood_donors' && selectedSubCategory === 'রক্তদাতা' && !selectedBloodGroup && !searchQuery && !showCommunity && !showMap && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা (গ্রুপ জানা নেই)', 'ব্লাড ব্যাংক'].map(bg => {
               const count = filteredContacts.filter(c => c.subCategory === bg).length;
               return (
                 <div key={bg} onClick={() => setSelectedBloodGroup(bg)} className="bg-white hover:bg-red-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none cursor-pointer">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                       <Droplets className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-medium text-center text-gray-800">{bg}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{toBengaliDigits(count.toString())} টি নাম্বার</span>
                    </div>
                 </div>
               );
            })}
          </div>
        )}

        {/* Contacts List (Shown when searching or inside a sub-category) */}
        {((selectedCategory && selectedSubCategory && (selectedCategory.id !== 'blood_donors' || selectedSubCategory !== 'রক্তদাতা' || selectedBloodGroup)) || searchQuery) && !showCommunity && !showMap && (`;

content = content.replace(`        {/* Contacts List (Shown when searching or inside a sub-category) */}
        {((selectedCategory && selectedSubCategory) || searchQuery) && !showCommunity && !showMap && (`, bloodGroupGrid);

// modify the contacts filter to use selectedBloodGroup
const oldFilter = `filteredContacts.filter(c => !selectedSubCategory || (c.subCategory || 'অন্যান্য') === selectedSubCategory)`;
const newFilter = `filteredContacts.filter(c => !selectedSubCategory || (selectedBloodGroup ? (c.subCategory === selectedBloodGroup) : ((c.subCategory || 'অন্যান্য') === selectedSubCategory)))`;

content = content.replaceAll(oldFilter, newFilter);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx modified");
