const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      if (editingContactId) {
        if (isAdmin) {
          // If admin, direct update
          await setDoc(doc(db, 'contacts', editingContactId), {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
            subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
          }, { merge: true });
        } else {
          payload.replacesId = editingContactId;
          await addDoc(collection(db, 'contacts'), payload);
        }
      } else {
        await addDoc(collection(db, 'contacts'), payload);
      }`;

const replacement = `      if (editingContactId) {
        if (isAdmin) {
          // If admin, direct update
          await setDoc(doc(db, 'contacts', editingContactId), {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
            subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
          }, { merge: true });
        } else {
          payload.replacesId = editingContactId;
          await addDoc(collection(db, 'contacts'), payload);
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: 'admin',
            type: 'number_edit_request',
            title: 'নাম্বার এডিট রিকোয়েস্ট',
            body: \`\${newName} - \${newPhone}\`,
            read: false,
            createdAt: new Date().toISOString(),
            link: 'requests'
          });
        }
      } else {
        await addDoc(collection(db, 'contacts'), payload);
        if (!isAdmin) {
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: 'admin',
            type: 'number_request',
            title: 'নতুন নাম্বার রিকোয়েস্ট',
            body: \`\${newName} - \${newPhone}\`,
            read: false,
            createdAt: new Date().toISOString(),
            link: 'requests'
          });
        }
      }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched successfully.");
} else {
  console.log("Target not found!");
}
