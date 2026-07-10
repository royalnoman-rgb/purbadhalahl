const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      const payload: any = {`;

const replacement = `  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      // Check for duplicates if it's a new contact
      if (!editingContactId) {
        const isStaticDuplicate = staticContacts.some(c => c.phone === newPhone || c.name.toLowerCase() === newName.toLowerCase());
        if (isStaticDuplicate) {
          alert('এই নাম বা নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!');
          setRequestStatus('idle');
          return;
        }

        const qPhone = query(collection(db, 'contacts'), where('phone', '==', newPhone));
        const phoneSnapshot = await getDocs(qPhone);
        if (!phoneSnapshot.empty) {
          alert('এই নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!');
          setRequestStatus('idle');
          return;
        }

        const qName = query(collection(db, 'contacts'), where('name', '==', newName));
        const nameSnapshot = await getDocs(qName);
        if (!nameSnapshot.empty) {
          alert('এই নামটি ইতিমধ্যে যুক্ত করা আছে!');
          setRequestStatus('idle');
          return;
        }
      }

      const payload: any = {`;

const newCode = code.replace(target, replacement);
if (code === newCode) {
  console.log("NOT REPLACED");
} else {
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("REPLACED");
}
