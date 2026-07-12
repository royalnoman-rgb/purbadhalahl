const fs = require('fs');
let code = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');
code = code.replace("import { collection, query, where, onSnapshot, writeBatch, doc, getDocs } from 'firebase/firestore';", "import { collection, query, where, onSnapshot, writeBatch, doc, getDocs, setDoc } from 'firebase/firestore';\nimport { categories as staticCategories, contacts as staticContacts } from '../data';");

const target = `    const unsubContacts = onSnapshot(qContacts, (snap) => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });`;

const replacement = `    const unsubContacts = onSnapshot(qContacts, (snap) => {
      const dynamicContacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
      const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id));
      const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id));
      
      const allContacts = [...activeStaticContacts, ...activeDynamicContacts];
      // filter out duplicates by id (prefer dynamic)
      const uniqueContacts = Array.from(new Map(allContacts.map(item => [item.id, item])).values());
      setContacts(uniqueContacts);
    });`;

code = code.replace(target, replacement);

const targetCat = `    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });`;

const replacementCat = `    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snap) => {
      const dynamicCategories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const dynamicCategoryIds = new Set(dynamicCategories.map(c => c.id));
      const activeStaticCategories = staticCategories.filter(c => !dynamicCategoryIds.has(c.id));
      setCategories([...activeStaticCategories, ...dynamicCategories]);
    });`;

code = code.replace(targetCat, replacementCat);

const renameSubcatTarget = `batch.update(doc(db, 'contacts', contact.id), { subCategory: editSubCatTitle.trim() });`;
const renameSubcatReplace = `batch.set(doc(db, 'contacts', contact.id), { ...contact, subCategory: editSubCatTitle.trim() }, { merge: true });`;

code = code.replace(renameSubcatTarget, renameSubcatReplace);

const bulkMoveTarget = `batch.update(doc(db, 'contacts', contactId), {
          categoryId: targetCatId,
          subCategory: targetSubCat || ''
        });`;
const bulkMoveReplace = `
        const contactToUpdate = contacts.find(c => c.id === contactId);
        if (contactToUpdate) {
            batch.set(doc(db, 'contacts', contactId), {
              ...contactToUpdate,
              categoryId: targetCatId,
              subCategory: targetSubCat || ''
            }, { merge: true });
        }`;

code = code.replace(bulkMoveTarget, bulkMoveReplace);

fs.writeFileSync('src/components/DataManagementTab.tsx', code);
