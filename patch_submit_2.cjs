const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Helper to get category name[\s\S]*?(?=const payload: any = \{)/;

const newCheck = `// Helper to get category name
      const getCatName = (catId) => allCategories.find(c => c.id === catId)?.title || catId;

      // 1. Check in allContacts (which has the latest state for approved static/dynamic contacts)
      const existingDup = allContacts.find(c => 
         (c.phone === newPhone || c.name.toLowerCase() === newName.toLowerCase()) && 
         (!editingContactId || c.id !== editingContactId)
      );
      if (existingDup) {
        alert(\`এই নাম বা নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!\\nক্যাটাগরি: \${getCatName(existingDup.categoryId)}\\nসাব-ক্যাটাগরি: \${existingDup.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      // 2. Check for pending duplicates in firestore
      const qPhone = query(collection(db, 'contacts'), where('phone', '==', newPhone));
      const phoneSnapshot = await getDocs(qPhone);
      const phoneDup = phoneSnapshot.docs.find(d => d.id !== editingContactId && d.data().replacesId !== editingContactId && d.data().status === 'pending');
      if (phoneDup) {
        const data = phoneDup.data();
        alert(\`এই নাম্বারটি ইতিমধ্যে যুক্ত করা আছে (পেন্ডিং অবস্থায়)!\\nক্যাটাগরি: \${getCatName(data.categoryId)}\\nসাব-ক্যাটাগরি: \${data.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      const qName = query(collection(db, 'contacts'), where('name', '==', newName));
      const nameSnapshot = await getDocs(qName);
      const nameDup = nameSnapshot.docs.find(d => d.id !== editingContactId && d.data().replacesId !== editingContactId && d.data().status === 'pending');
      if (nameDup) {
        const data = nameDup.data();
        alert(\`এই নামটি ইতিমধ্যে যুক্ত করা আছে (পেন্ডিং অবস্থায়)!\\nক্যাটাগরি: \${getCatName(data.categoryId)}\\nসাব-ক্যাটাগরি: \${data.subCategory || '-'}\`);
        setRequestStatus('idle');
        return;
      }

      `;

if (regex.test(content)) {
  content = content.replace(regex, newCheck);
  fs.writeFileSync(file, content);
  console.log('Patched handleRequestSubmit successfully!');
} else {
  console.log('Could not find regex match string.');
}
