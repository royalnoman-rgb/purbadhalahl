const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `  const handleDeleteContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        await deleteDoc(contactRef);
        await logAdminAction(\`Contact deleted: \${data.name || 'Unknown'}\`);
      }
      fetchData();
    }
  };`;
const replace = `  const handleDeleteContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      const data = contactSnap.data();
      await deleteDoc(contactRef);
      await logAdminAction(\`Contact deleted: \${data.name || 'Unknown'}\`);
    }
    fetchData();
  };`;

// What if the backtick is missing the closing brace?
const target2 = `  const handleDeleteContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        await deleteDoc(contactRef);
        await logAdminAction(\`Contact deleted: \${data.name || 'Unknown'\`);
      }
      fetchData();
    }
  };`;

if (code.includes(target)) {
  code = code.replace(target, replace);
} else if (code.includes(target2)) {
  code = code.replace(target2, replace);
} else {
  console.log("Not found!");
}

fs.writeFileSync('src/Admin.tsx', code);
