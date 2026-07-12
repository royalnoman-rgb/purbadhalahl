const fs = require('fs');
let code = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');

const target = `  const currentCatSubcats = subcategories.filter(sc => sc.categoryId === selectedCatId);
  const targetCatSubcats = subcategories.filter(sc => sc.categoryId === targetCatId);`;

const replacement = `  const getDerivedSubcats = (catId: string) => {
    const fromContacts = contacts.filter(c => c.categoryId === catId && c.subCategory).map(c => c.subCategory);
    const fromDocs = subcategories.filter(sc => sc.categoryId === catId).map(sc => sc.title);
    
    return Array.from(new Set([...fromContacts, ...fromDocs])).map(title => {
      const docInfo = subcategories.find(sc => sc.categoryId === catId && sc.title === title);
      return {
        id: docInfo ? docInfo.id : \`virtual_\${title}\`,
        title,
        categoryId: catId
      };
    });
  };

  const currentCatSubcats = selectedCatId ? getDerivedSubcats(selectedCatId) : [];
  const targetCatSubcats = targetCatId ? getDerivedSubcats(targetCatId) : [];`;

code = code.replace(target, replacement);

const renameTarget = `      // Update subcategory doc
      batch.update(doc(db, 'subcategories', subcatId), { title: editSubCatTitle.trim() });`;

const renameReplace = `      // Update subcategory doc if it's real
      if (!subcatId.startsWith('virtual_')) {
        batch.update(doc(db, 'subcategories', subcatId), { title: editSubCatTitle.trim() });
      }`;

code = code.replace(renameTarget, renameReplace);

fs.writeFileSync('src/components/DataManagementTab.tsx', code);
