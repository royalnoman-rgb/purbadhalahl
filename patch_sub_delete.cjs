const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleDeleteSubCategoryFront = async (subCat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান? এই সাব-ক্যাটাগরির সকল কন্টাক্ট "অন্যান্য" তে চলে যাবে।', async () => {
      try {
        const batch = writeBatch(db);
        
        const newDeleted = [...(selectedCategory.deletedSubCategories || []), subCat];
        batch.set(doc(db, 'categories', selectedCategory.id), { deletedSubCategories: newDeleted }, { merge: true });
        
        const matchingContacts = dynamicContacts.filter(c => c.categoryId === selectedCategory.id && c.subCategory === subCat);
        matchingContacts.forEach(contact => {
          batch.set(doc(db, 'contacts', contact.id), { ...contact, subCategory: 'অন্যান্য', status: 'approved' }, { merge: true });
        });

        const dynSubCat = dynamicSubCategories.find(sc => sc.categoryId === selectedCategory.id && sc.title === subCat);
        if (dynSubCat && !dynSubCat.id.startsWith('virtual_')) {
          batch.delete(doc(db, 'subcategories', dynSubCat.id));
        }

        await batch.commit();
      } catch (error) {`;

const replacement = `  const handleDeleteSubCategoryFront = async (subCat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান? এই সাব-ক্যাটাগরির সকল কন্টাক্ট "অন্যান্য" তে চলে যাবে।', async () => {
      try {
        const batch = writeBatch(db);
        
        const newDeleted = [...(selectedCategory.deletedSubCategories || []), subCat];
        batch.set(doc(db, 'categories', selectedCategory.id), { deletedSubCategories: newDeleted }, { merge: true });
        
        const matchingContacts = dynamicContacts.filter(c => c.categoryId === selectedCategory.id && c.subCategory === subCat);
        matchingContacts.forEach(contact => {
          batch.set(doc(db, 'contacts', contact.id), { ...contact, subCategory: 'অন্যান্য', status: 'approved' }, { merge: true });
        });

        const dynSubCat = dynamicSubCategories.find(sc => sc.categoryId === selectedCategory.id && sc.title === subCat);
        if (dynSubCat && !dynSubCat.id.startsWith('virtual_')) {
          batch.delete(doc(db, 'subcategories', dynSubCat.id));
        }

        await batch.commit();

        setDynamicCategories(prev => prev.map(c => c.id === selectedCategory.id ? { ...c, deletedSubCategories: newDeleted } : c));
        setDynamicContacts(prev => prev.map(c => c.categoryId === selectedCategory.id && c.subCategory === subCat ? { ...c, subCategory: 'অন্যান্য' } : c));
        if (dynSubCat) {
          setDynamicSubCategories(prev => prev.filter(sc => sc.id !== dynSubCat.id));
        }
        safeStorage.removeItem('cats_cache');
        safeStorage.removeItem('cats_cache_time');
        safeStorage.removeItem('contacts_cache');
        safeStorage.removeItem('contacts_cache_time');
        safeStorage.removeItem('subCats_cache');
        safeStorage.removeItem('subCats_cache_time');
        setSelectedCategory(prev => prev && prev.id === selectedCategory.id ? { ...prev, deletedSubCategories: newDeleted } : prev);
      } catch (error) {`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched handleDeleteSubCategoryFront");
