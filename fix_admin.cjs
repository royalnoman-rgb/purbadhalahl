const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target1 = `  const handleDeleteContributor = async (id: string) => {
    await deleteDoc(doc(db, 'contributors', id));
      await logAdminAction(\`Contributor deleted (ID: \${id})\`);
      fetchData();
    }
  };`;
const replace1 = `  const handleDeleteContributor = async (id: string) => {
    await deleteDoc(doc(db, 'contributors', id));
    await logAdminAction(\`Contributor deleted (ID: \${id})\`);
    fetchData();
  };`;
code = code.replace(target1, replace1);

const target2 = `  const handleDeleteCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
      const catSnap = await getDoc(catRef);
      await deleteDoc(catRef);
      if(catSnap.exists()) await logAdminAction(\`Category deleted: \${catSnap.data().title || 'Unknown'}\`);
      fetchData();
    }
  };`;
const replace2 = `  const handleDeleteCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
    const catSnap = await getDoc(catRef);
    await deleteDoc(catRef);
    if(catSnap.exists()) await logAdminAction(\`Category deleted: \${catSnap.data().title || 'Unknown'}\`);
    fetchData();
  };`;
code = code.replace(target2, replace2);

const target3 = `  const handleDeleteFeedback = async (id: string) => {
    const fbRef = doc(db, 'feedback', id);
      const fbSnap = await getDoc(fbRef);
      await deleteDoc(fbRef);
      if(fbSnap.exists()) await logAdminAction(\`Feedback deleted from: \${fbSnap.data().name || 'Unknown'}\`);
      fetchData();
    }
  };`;
const replace3 = `  const handleDeleteFeedback = async (id: string) => {
    const fbRef = doc(db, 'feedback', id);
    const fbSnap = await getDoc(fbRef);
    await deleteDoc(fbRef);
    if(fbSnap.exists()) await logAdminAction(\`Feedback deleted from: \${fbSnap.data().name || 'Unknown'}\`);
    fetchData();
  };`;
code = code.replace(target3, replace3);

const target4 = `  const handleDeletePublicReview = async (id: string) => {
    await deleteDoc(doc(db, 'public_reviews', id));
      await logAdminAction(\`Public review deleted (ID: \${id})\`);
      fetchData();
    }
  };`;
const replace4 = `  const handleDeletePublicReview = async (id: string) => {
    await deleteDoc(doc(db, 'public_reviews', id));
    await logAdminAction(\`Public review deleted (ID: \${id})\`);
    fetchData();
  };`;
code = code.replace(target4, replace4);

fs.writeFileSync('src/Admin.tsx', code);
