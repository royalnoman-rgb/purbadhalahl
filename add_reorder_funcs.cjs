const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = "  const filteredContacts = allContacts.filter((c) => {";

const moveFuncs = `
  const handleMoveCategory = async (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === allCategories.length - 1)) return;
    
    const newCategories = [...allCategories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newCategories[index];
    newCategories[index] = newCategories[swapIndex];
    newCategories[swapIndex] = temp;

    for (let i = 0; i < newCategories.length; i++) {
      const cat = newCategories[i];
      if (cat.order !== i) {
        if (dynamicCategoryIds.has(cat.id)) {
          updateDoc(doc(db, 'categories', cat.id), { order: i }).catch(console.error);
        } else {
          setDoc(doc(db, 'categories', cat.id), { ...cat, order: i, status: 'approved' }).catch(console.error);
        }
      }
    }
  };

  const handleMoveContact = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === filteredContacts.length - 1)) return;
    
    const newContacts = [...filteredContacts];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newContacts[index];
    newContacts[index] = newContacts[swapIndex];
    newContacts[swapIndex] = temp;

    const dynamicContactIds = new Set(dynamicContacts.map(c => c.id));

    for (let i = 0; i < newContacts.length; i++) {
      const contact = newContacts[i];
      if (contact.order !== i) {
        if (dynamicContactIds.has(contact.id)) {
          updateDoc(doc(db, 'contacts', contact.id), { order: i }).catch(console.error);
        } else {
          setDoc(doc(db, 'contacts', contact.id), { ...contact, order: i, status: 'approved' }).catch(console.error);
        }
      }
    }
  };
`;

code = code.replace(targetStr, moveFuncs + "\n" + targetStr);

// Fix the filteredContacts sort so it uses 9999 as default
code = code.replace(".sort((a: any, b: any) => (a.order || 0) - (b.order || 0));", ".sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));");

fs.writeFileSync('src/App.tsx', code);
