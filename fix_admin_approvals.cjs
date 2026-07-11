const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target1 = `  const handleApproveCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
    const catSnap = await getDoc(catRef);
    await updateDoc(catRef, { status: 'approved' });
    if(catSnap.exists()) await logAdminAction(\`Category approved: \${catSnap.data().title || 'Unknown'}\`);
    fetchData();
  };`;

const replace1 = `  const handleApproveCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
    const catSnap = await getDoc(catRef);
    await updateDoc(catRef, { status: 'approved' });
    
    if(catSnap.exists()) {
      const data = catSnap.data();
      await logAdminAction(\`Category approved: \${data.title || 'Unknown'}\`);
      
      if (data.contributorPhone) {
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: data.contributorPhone,
          type: 'approval',
          title: 'রিকোয়েস্ট এপ্রুভ হয়েছে!',
          body: \`আপনার দেওয়া "\${data.title}" ক্যাটাগরিটি এপ্রুভ করা হয়েছে।\`,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'community'
        });
      }
    }
    fetchData();
  };`;

code = code.replace(target1, replace1);

const target2 = `  const handleApproveContact = async (id: string) => {
    const conRef = doc(db, 'contacts', id);
    const conSnap = await getDoc(conRef);
    await updateDoc(conRef, { status: 'approved' });
    if(conSnap.exists()) {
      const data = conSnap.data();
      await logAdminAction(\`Contact approved: \${data.name || 'Unknown'}\`);
      if (data.contributorPhone) {
        const cRef = doc(db, 'contributors', data.contributorPhone);
        const cSnap = await getDoc(cRef);
        if (cSnap.exists()) {
           await updateDoc(cRef, { points: increment(10), approvedCount: increment(1) });
        }
      }
    }
    fetchData();
  };`;

const replace2 = `  const handleApproveContact = async (id: string) => {
    const conRef = doc(db, 'contacts', id);
    const conSnap = await getDoc(conRef);
    await updateDoc(conRef, { status: 'approved' });
    if(conSnap.exists()) {
      const data = conSnap.data();
      await logAdminAction(\`Contact approved: \${data.name || 'Unknown'}\`);
      if (data.contributorPhone) {
        const cRef = doc(db, 'contributors', data.contributorPhone);
        const cSnap = await getDoc(cRef);
        if (cSnap.exists()) {
           await updateDoc(cRef, { points: increment(10), approvedCount: increment(1) });
        }
        
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: data.contributorPhone,
          type: 'approval',
          title: 'রিকোয়েস্ট এপ্রুভ হয়েছে!',
          body: \`আপনার দেওয়া "\${data.name}" নাম্বারটি এপ্রুভ করা হয়েছে এবং আপনি 10 পয়েন্ট পেয়েছেন!\`,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'community'
        });
      }
    }
    fetchData();
  };`;

code = code.replace(target2, replace2);
fs.writeFileSync('src/Admin.tsx', code);
