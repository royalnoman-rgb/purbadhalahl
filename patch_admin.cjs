const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const approveLogic = `  const handleApproveContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      const contactData = contactSnap.data();
      await updateDoc(contactRef, { status: 'approved' });
      await logAdminAction(\`Contact approved: \${contactData.name || 'Unknown'}\`);
      
      // If this was an edit request replacing an old contact, delete the old contact
      if (contactData.replacesId) {
        try {
          await deleteDoc(doc(db, 'contacts', contactData.replacesId));
        } catch (e) {
          console.error("Failed to delete replaced contact", e);
        }
      }

      if (contactData.contributorPhone && contactData.contributorName) {
        const contributorRef = doc(db, 'contributors', contactData.contributorPhone);`;

content = content.replace(`  const handleApproveContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      const contactData = contactSnap.data();
      await updateDoc(contactRef, { status: 'approved' });
      await logAdminAction(\`Contact approved: \${contactData.name || 'Unknown'}\`);
      
      if (contactData.contributorPhone && contactData.contributorName) {
        const contributorRef = doc(db, 'contributors', contactData.contributorPhone);`, approveLogic);

fs.writeFileSync('src/Admin.tsx', content);
console.log("Admin.tsx patched");
