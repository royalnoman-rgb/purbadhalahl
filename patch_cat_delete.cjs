const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleDeleteCategoryApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        console.error(err);
      }
    });
  };`;

const replacement = `  const handleDeleteCategoryApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setDynamicCategories(prev => prev.filter(c => c.id !== id));
        safeStorage.removeItem('cats_cache');
        safeStorage.removeItem('cats_cache_time');
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
        }
      } catch (err) {
        console.error(err);
      }
    });
  };`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched handleDeleteCategoryApp");
