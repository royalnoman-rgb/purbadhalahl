const fs = require('fs');
let content = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');

content = content.replace(
  `    const unsubCat = onSnapshot(qCat, (snap) => {
      const dynamicCategories = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      const dynamicCategoryIds = new Set(dynamicCategories.map(c => c.id));
      const combined = [
        ...staticCategories,
        ...dynamicCategories.filter(c => !staticCategories.some(sc => sc.id === c.id))
      ];
      setCategories(combined.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
    });`,
  `    const unsubCat = onSnapshot(qCat, (snap) => {
      const dynamicCategories = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      const dynamicCategoryIds = new Set(dynamicCategories.map(c => c.id));
      const combined = [
        ...staticCategories,
        ...dynamicCategories.filter(c => !staticCategories.some(sc => sc.id === c.id))
      ];
      setCategories(combined.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
    }, (error) => console.error("DataManagementTab Categories Error:", error));`
);

content = content.replace(
  `    const unsubSubCat = onSnapshot(qSubCat, (snap) => {
      setSubCategories(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });`,
  `    const unsubSubCat = onSnapshot(qSubCat, (snap) => {
      setSubCategories(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (error) => console.error("DataManagementTab SubCategories Error:", error));`
);

content = content.replace(
  `    const unsubContacts = onSnapshot(qContacts, (snap) => {
      const dynamicContacts = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
      const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
      
      const filteredStatic = staticContacts.filter(c => !replacedIds.has(c.id));
      const filteredDynamic = dynamicContacts.filter(c => c.status === 'approved' || c.status === 'pending');
      
      setContacts([...filteredStatic, ...filteredDynamic]);
    });`,
  `    const unsubContacts = onSnapshot(qContacts, (snap) => {
      const dynamicContacts = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
      const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
      
      const filteredStatic = staticContacts.filter(c => !replacedIds.has(c.id));
      const filteredDynamic = dynamicContacts.filter(c => c.status === 'approved' || c.status === 'pending');
      
      setContacts([...filteredStatic, ...filteredDynamic]);
    }, (error) => console.error("DataManagementTab Contacts Error:", error));`
);

fs.writeFileSync('src/components/DataManagementTab.tsx', content);
console.log("Patched DataManagementTab.tsx");
