const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

code = code.replace("await logAdminAction(`Public review deleted (ID: ${id)`);", "await logAdminAction(`Public review deleted (ID: ${id})`);");
code = code.replace("await logAdminAction(`Contributor deleted (ID: ${id)`);", "await logAdminAction(`Contributor deleted (ID: ${id})`);");
code = code.replace("if(catSnap.exists()) await logAdminAction(`Category deleted: ${catSnap.data().title || 'Unknown'`);", "if(catSnap.exists()) await logAdminAction(`Category deleted: ${catSnap.data().title || 'Unknown'}`);");
code = code.replace("if(fbSnap.exists()) await logAdminAction(`Feedback deleted from: ${fbSnap.data().name || 'Unknown'`);", "if(fbSnap.exists()) await logAdminAction(`Feedback deleted from: ${fbSnap.data().name || 'Unknown'}`);");

// remove the extra closing braces
code = code.replace(`  const handleDeletePublicReview = async (id: string) => {
    await deleteDoc(doc(db, 'public_reviews', id));
      await logAdminAction(\`Public review deleted (ID: \${id})\`);
      fetchData();
    }
  };`, `  const handleDeletePublicReview = async (id: string) => {
    await deleteDoc(doc(db, 'public_reviews', id));
    await logAdminAction(\`Public review deleted (ID: \${id})\`);
    fetchData();
  };`);

code = code.replace(`  const handleDeleteContributor = async (id: string) => {
    await deleteDoc(doc(db, 'contributors', id));
      await logAdminAction(\`Contributor deleted (ID: \${id})\`);
      fetchData();
    }
  };`, `  const handleDeleteContributor = async (id: string) => {
    await deleteDoc(doc(db, 'contributors', id));
    await logAdminAction(\`Contributor deleted (ID: \${id})\`);
    fetchData();
  };`);

code = code.replace(`  const handleDeleteCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
      const catSnap = await getDoc(catRef);
      await deleteDoc(catRef);
      if(catSnap.exists()) await logAdminAction(\`Category deleted: \${catSnap.data().title || 'Unknown'}\`);
      fetchData();
    }
  };`, `  const handleDeleteCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
    const catSnap = await getDoc(catRef);
    await deleteDoc(catRef);
    if(catSnap.exists()) await logAdminAction(\`Category deleted: \${catSnap.data().title || 'Unknown'}\`);
    fetchData();
  };`);

code = code.replace(`  const handleDeleteFeedback = async (id: string) => {
    const fbRef = doc(db, 'feedback', id);
      const fbSnap = await getDoc(fbRef);
      await deleteDoc(fbRef);
      if(fbSnap.exists()) await logAdminAction(\`Feedback deleted from: \${fbSnap.data().name || 'Unknown'}\`);
      fetchData();
    }
  };`, `  const handleDeleteFeedback = async (id: string) => {
    const fbRef = doc(db, 'feedback', id);
    const fbSnap = await getDoc(fbRef);
    await deleteDoc(fbRef);
    if(fbSnap.exists()) await logAdminAction(\`Feedback deleted from: \${fbSnap.data().name || 'Unknown'}\`);
    fetchData();
  };`);

fs.writeFileSync('src/Admin.tsx', code);
