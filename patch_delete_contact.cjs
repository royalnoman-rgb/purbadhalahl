const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetMethod = `  const handleDeleteContactApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        setDynamicContacts(prev => prev.filter(c => c.id !== id));
        safeStorage.removeItem('contacts_cache');
        safeStorage.removeItem('contacts_cache_time');
      } catch (err) {
        console.error(err);
      }
    });
  };`;

const replacementMethod = `  const handleDeleteContactApp = (contact: any, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'contacts', contact.id));
        setDynamicContacts(prev => prev.filter(c => c.id !== contact.id));
        
        if (contact.categoryId) {
          const cat = dynamicCategories.find(c => c.id === contact.categoryId);
          if (cat) {
            const newDeleted = [...(cat.deletedContacts || []), contact.id];
            await updateDoc(doc(db, 'categories', contact.categoryId), { deletedContacts: newDeleted });
            setDynamicCategories(prev => prev.map(c => c.id === contact.categoryId ? { ...c, deletedContacts: newDeleted } : c));
            if (selectedCategory?.id === contact.categoryId) {
              setSelectedCategory({ ...selectedCategory, deletedContacts: newDeleted });
            }
            safeStorage.removeItem('cats_cache');
            safeStorage.removeItem('cats_cache_time');
          }
        }
        
        safeStorage.removeItem('contacts_cache');
        safeStorage.removeItem('contacts_cache_time');
      } catch (err) {
        console.error(err);
      }
    });
  };`;

content = content.replace(targetMethod, replacementMethod);

const targetUsage = `<button onClick={(e) => handleDeleteContactApp(contact.id, e)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="ডিলিট করুন">`;
const replacementUsage = `<button onClick={(e) => handleDeleteContactApp(contact, e)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="ডিলিট করুন">`;

content = content.replace(targetUsage, replacementUsage);

const targetFilter = `  // Handle replaced contacts (edits)
  const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
  const dynamicContactIds = new Set(dynamicContacts.map(c => c.id));
  const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id) && !dynamicContactIds.has(c.id));
  const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id));
  const allContacts = [...activeStaticContacts, ...activeDynamicContacts].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));`;

const replacementFilter = `  // Handle replaced contacts (edits)
  const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
  const dynamicContactIds = new Set(dynamicContacts.map(c => c.id));
  
  const deletedContactIds = new Set();
  dynamicCategories.forEach(cat => {
    if (cat.deletedContacts) {
      cat.deletedContacts.forEach((id: string) => deletedContactIds.add(id));
    }
  });

  const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id) && !dynamicContactIds.has(c.id) && !deletedContactIds.has(c.id));
  const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id) && !deletedContactIds.has(c.id));
  const allContacts = [...activeStaticContacts, ...activeDynamicContacts].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));`;

content = content.replace(targetFilter, replacementFilter);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched contact deletion logic");
