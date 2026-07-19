const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetContacts = `  // Handle replaced contacts (edits)
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

const replacementContacts = `  const allContacts = React.useMemo(() => {
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
    return [...activeStaticContacts, ...activeDynamicContacts].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [dynamicContacts, dynamicCategories]);`;

if (code.includes(targetContacts)) {
  code = code.replace(targetContacts, replacementContacts);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Memoized contacts');
} else {
  console.log('Target not found for contacts memoization');
}
