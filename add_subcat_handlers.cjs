const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStr = `  const handleDeleteCategoryApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        console.error(err);
      }
    });
  };`;

const replaceStr = searchStr + `

  const [editingSubCatIdFront, setEditingSubCatIdFront] = useState<string | null>(null);
  const [editSubCatTitleFront, setEditSubCatTitleFront] = useState('');

  const handleRenameSubCategoryFront = async (oldTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editSubCatTitleFront.trim() || editSubCatTitleFront === oldTitle || !selectedCategory) {
      setEditingSubCatIdFront(null);
      return;
    }
    
    try {
      const batch = writeBatch(db);
      
      const dynSubCat = dynamicSubCategories.find(sc => sc.categoryId === selectedCategory.id && sc.title === oldTitle);
      if (dynSubCat && !dynSubCat.id.startsWith('virtual_')) {
        batch.update(doc(db, 'subcategories', dynSubCat.id), { title: editSubCatTitleFront.trim() });
      }
      
      const matchingContacts = dynamicContacts.filter(c => c.categoryId === selectedCategory.id && c.subCategory === oldTitle);
      matchingContacts.forEach(contact => {
        batch.set(doc(db, 'contacts', contact.id), { ...contact, subCategory: editSubCatTitleFront.trim(), status: 'approved' }, { merge: true });
      });

      const isPredefined = predefinedSubCategories.find(pc => pc.categoryId === selectedCategory.id)?.subCategories.includes(oldTitle);
      if (isPredefined) {
         const newDeleted = [...(selectedCategory.deletedSubCategories || []), oldTitle];
         batch.set(doc(db, 'categories', selectedCategory.id), { deletedSubCategories: newDeleted }, { merge: true });
      }

      const currentOrder = selectedCategory.subCategoriesOrder || [];
      const newOrder = currentOrder.map(sub => sub === oldTitle ? editSubCatTitleFront.trim() : sub);
      if (currentOrder.includes(oldTitle)) {
        batch.set(doc(db, 'categories', selectedCategory.id), { subCategoriesOrder: newOrder }, { merge: true });
      }
      
      await batch.commit();
      setEditingSubCatIdFront(null);
    } catch (error) {
      console.error(error);
      alert('Error renaming subcategory');
    }
  };

  const handleDeleteSubCategoryFront = async (subCat: string, e: React.MouseEvent) => {
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
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    });
  };

  const handleMoveSubCategoryFront = async (subCat: string, direction: 'up' | 'down', sortedSubCats: string[], e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    
    const currentIndex = sortedSubCats.indexOf(subCat);
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sortedSubCats.length - 1)) return;
    
    const newOrder = [...sortedSubCats];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newOrder[currentIndex], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[currentIndex]];
    
    try {
      await setDoc(doc(db, 'categories', selectedCategory.id), { subCategoriesOrder: newOrder }, { merge: true });
      setSelectedCategory({ ...selectedCategory, subCategoriesOrder: newOrder });
    } catch (error) {
      console.error('Error repositioning subcategory:', error);
    }
  };`;

if(code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Success adding handlers');
} else {
  console.log('Could not find search string');
}
