const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        categoryId: newCategory,
        status: 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };
      
      if (editingContactId) {
        payload.replacesId = editingContactId;
      }
      
      await addDoc(collection(db, 'contacts'), payload);`;

const replacement = `      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        categoryId: newCategory,
        status: isAdmin ? 'approved' : 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };
      
      if (editingContactId) {
        if (isAdmin) {
          // If admin, direct update
          await updateDoc(doc(db, 'contacts', editingContactId), {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
          });
        } else {
          payload.replacesId = editingContactId;
          await addDoc(collection(db, 'contacts'), payload);
        }
      } else {
        await addDoc(collection(db, 'contacts'), payload);
      }`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
