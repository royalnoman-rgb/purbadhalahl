const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Check for duplicates in static contacts[\s\S]*?(?=const payload: any = \{)/;

const newCheck = `// Helper to get category name
      const getCatName = (catId) => allCategories.find(c => c.id === catId)?.title || catId;

      // Check for duplicates in static contacts
      const staticDup = staticContacts.find(c => 
         (c.phone === newPhone || c.name.toLowerCase() === newName.toLowerCase()) && 
         (!editingContactId || c.id !== editingContactId)
      );
      if (staticDup) {
        alert(\`এই নাম বা নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!\\nক্যাটাগরি: \${getCatName(staticDup.categoryId)}\\nসাব-ক্যাটাগরি: \${staticDup.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      // Check for duplicates in firestore
      const qPhone = query(collection(db, 'contacts'), where('phone', '==', newPhone));
      const phoneSnapshot = await getDocs(qPhone);
      const phoneDup = phoneSnapshot.docs.find(d => d.id !== editingContactId && d.data().replacesId !== editingContactId);
      if (phoneDup) {
        const data = phoneDup.data();
        alert(\`এই নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!\\nক্যাটাগরি: \${getCatName(data.categoryId)}\\nসাব-ক্যাটাগরি: \${data.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      const qName = query(collection(db, 'contacts'), where('name', '==', newName));
      const nameSnapshot = await getDocs(qName);
      const nameDup = nameSnapshot.docs.find(d => d.id !== editingContactId && d.data().replacesId !== editingContactId);
      if (nameDup) {
        const data = nameDup.data();
        alert(\`এই নামটি ইতিমধ্যে যুক্ত করা আছে!\\nক্যাটাগরি: \${getCatName(data.categoryId)}\\nসাব-ক্যাটাগরি: \${data.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      `;

if (regex.test(content)) {
  content = content.replace(regex, newCheck);
  fs.writeFileSync(file, content);
  console.log('Patched handleRequestSubmit successfully!');
} else {
  console.log('Could not find old check string.');
}
