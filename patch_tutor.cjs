const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace any occurrence of 'প্রাইভেট টিউটর' mapped to 'প্রাইভেট টিউটর ও কোচিং সেন্টার'
code = code.replace(/c\.subCategory === 'প্রাইভেট টিউটর' \? 'প্রাইভেট টিউটর ও কোচিং সেন্টার' : /g, ""); // clean up if exists

// Find allContacts mapping to replace it
const targetContacts = `    const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id) && !dynamicContactIds.has(c.id) && !deletedContactIds.has(c.id));
    const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id) && !deletedContactIds.has(c.id));
    return [...activeStaticContacts, ...activeDynamicContacts].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));`;

const replacementContacts = `    const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id) && !dynamicContactIds.has(c.id) && !deletedContactIds.has(c.id));
    const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id) && !deletedContactIds.has(c.id));
    return [...activeStaticContacts, ...activeDynamicContacts].map(c => c.subCategory === 'প্রাইভেট টিউটর' ? { ...c, subCategory: 'প্রাইভেট টিউটর ও কোচিং সেন্টার' } : c).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));`;

if (code.includes(targetContacts)) {
  code = code.replace(targetContacts, replacementContacts);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Updated App.tsx contacts mapping");
} else {
  console.log("targetContacts not found in App.tsx");
}

let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');
const targetAdminContacts = `setContacts(contactsSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));`;
const replacementAdminContacts = `setContacts(contactsSnapshot.docs.map(d => {
        const data = d.data();
        if (data.subCategory === 'প্রাইভেট টিউটর') data.subCategory = 'প্রাইভেট টিউটর ও কোচিং সেন্টার';
        return { ...data, id: d.id };
      }));`;

if (adminCode.includes(targetAdminContacts)) {
  adminCode = adminCode.replace(targetAdminContacts, replacementAdminContacts);
  fs.writeFileSync('src/Admin.tsx', adminCode);
  console.log("Updated Admin.tsx contacts mapping");
} else {
  console.log("targetAdminContacts not found in Admin.tsx");
}

