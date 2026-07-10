const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

// Import ConfirmDialog
code = code.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { ConfirmDialog } from './components/ConfirmDialog';");

// Add state
const targetState = `  const [deletedPosts, setDeletedPosts] = useState<any[]>([]);`;
const replaceState = `  const [deletedPosts, setDeletedPosts] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
code = code.replace(targetState, replaceState);

// Replace handleDeleteContact
code = code.replace(
  /const handleDeleteContact = async \(id: string\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+const contactRef = doc\(db, 'contacts', id\);\s+const contactSnap = await getDoc\(contactRef\);\s+if \(contactSnap\.exists\(\)\) \{\s+const data = contactSnap\.data\(\);\s+await deleteDoc\(contactRef\);\s+await logAdminAction\(`Contact deleted: \$\{data\.name \|\| 'Unknown'\}`\);\s+\}\s+fetchData\(\);\s+\};/g,
  `const handleDeleteContact = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const contactRef = doc(db, 'contacts', id);
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        await deleteDoc(contactRef);
        await logAdminAction(\`Contact deleted: \$\{data.name || 'Unknown'\}\`);
      }
      fetchData();
    });
  };`
);

// Replace handlePermanentDeletePost
code = code.replace(
  /const handlePermanentDeletePost = async \(id: string\) => \{\s+if \(window\.confirm\('পোস্টটি চিরতরে মুছে ফেলতে চান\?'\)\) \{\s+await deleteDoc\(doc\(db, 'community_posts', id\)\);\s+await logAdminAction\(`Post permanently deleted \(ID: \$\{id\}\)`\);\s+fetchData\(\);\s+\}\s+\};/g,
  `const handlePermanentDeletePost = (id: string) => {
    confirmAction('পোস্টটি চিরতরে মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'community_posts', id));
      await logAdminAction(\`Post permanently deleted (ID: \$\{id\})\`);
      fetchData();
    });
  };`
);

// Replace handleDeletePublicReview
code = code.replace(
  /const handleDeletePublicReview = async \(id: string\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+await deleteDoc\(doc\(db, 'public_reviews', id\)\);\s+await logAdminAction\(`Public review deleted \(ID: \$\{id\}\)`\);\s+fetchData\(\);\s+\};/g,
  `const handleDeletePublicReview = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'public_reviews', id));
      await logAdminAction(\`Public review deleted (ID: \$\{id\})\`);
      fetchData();
    });
  };`
);

// Replace handleDeleteContributor
code = code.replace(
  /const handleDeleteContributor = async \(id: string\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+await deleteDoc\(doc\(db, 'contributors', id\)\);\s+await logAdminAction\(`Contributor deleted \(ID: \$\{id\}\)`\);\s+fetchData\(\);\s+\};/g,
  `const handleDeleteContributor = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'contributors', id));
      await logAdminAction(\`Contributor deleted (ID: \$\{id\})\`);
      fetchData();
    });
  };`
);

// Replace handleDeleteCategory
code = code.replace(
  /const handleDeleteCategory = async \(id: string\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+const catRef = doc\(db, 'categories', id\);\s+const catSnap = await getDoc\(catRef\);\s+await deleteDoc\(catRef\);\s+if\(catSnap\.exists\(\)\) await logAdminAction\(`Category deleted: \$\{catSnap\.data\(\)\.title \|\| 'Unknown'\}`\);\s+fetchData\(\);\s+\};/g,
  `const handleDeleteCategory = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const catRef = doc(db, 'categories', id);
      const catSnap = await getDoc(catRef);
      await deleteDoc(catRef);
      if(catSnap.exists()) await logAdminAction(\`Category deleted: \$\{catSnap.data().title || 'Unknown'\}\`);
      fetchData();
    });
  };`
);

// Replace handleDeleteFeedback
code = code.replace(
  /const handleDeleteFeedback = async \(id: string\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+const fbRef = doc\(db, 'feedback', id\);\s+const fbSnap = await getDoc\(fbRef\);\s+await deleteDoc\(fbRef\);\s+if\(fbSnap\.exists\(\)\) await logAdminAction\(`Feedback deleted from: \$\{fbSnap\.data\(\)\.name \|\| 'Unknown'\}`\);\s+fetchData\(\);\s+\};/g,
  `const handleDeleteFeedback = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const fbRef = doc(db, 'feedback', id);
      const fbSnap = await getDoc(fbRef);
      await deleteDoc(fbRef);
      if(fbSnap.exists()) await logAdminAction(\`Feedback deleted from: \$\{fbSnap.data().name || 'Unknown'\}\`);
      fetchData();
    });
  };`
);

// Add the ConfirmDialog component to render
const targetRender = `<div className="space-y-8">`;
const replaceRender = `
        <ConfirmDialog 
          isOpen={confirmConfig.isOpen} 
          message={confirmConfig.message} 
          onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
          onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
        />
        <div className="space-y-8">`;
code = code.replace(targetRender, replaceRender);

fs.writeFileSync('src/Admin.tsx', code);
