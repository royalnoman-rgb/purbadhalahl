const fs = require('fs');

function fixApp() {
  let code = fs.readFileSync('src/App.tsx', 'utf8');
  if (!code.includes("import { ConfirmDialog }")) {
    code = code.replace("import Admin from './Admin';", "import Admin from './Admin';\nimport { ConfirmDialog } from './components/ConfirmDialog';");
  }
  
  if (!code.includes("const [confirmConfig")) {
    const targetState = `  const [feedbacks, setFeedbacks] = useState<any[]>([]);`;
    const replaceState = `  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
    code = code.replace(targetState, replaceState);
  }
  
  if (code.includes("if (!window.confirm")) {
    // Replace handleDeleteCategoryApp
    code = code.replace(
      /const handleDeleteCategoryApp = async \(id: string, e: React\.MouseEvent\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+e\.stopPropagation\(\);\s+try \{\s+await deleteDoc\(doc\(db, 'categories', id\)\);\s+alert\('ক্যাটাগরি মুছে ফেলা হয়েছে'\);\s+\} catch \(err\) \{\s+console\.error\(err\);\s+alert\('ত্রুটি হয়েছে'\);\s+\}\s+\};/g,
      `const handleDeleteCategoryApp = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
          try {
            await deleteDoc(doc(db, 'categories', id));
          } catch (err) {
            console.error(err);
          }
        });
      };`
    );

    // Replace handleDeleteContactApp
    code = code.replace(
      /const handleDeleteContactApp = async \(id: string, e: React\.MouseEvent\) => \{\s+if \(!window\.confirm\('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান\?'\)\) return;\s+e\.stopPropagation\(\);\s+try \{\s+await deleteDoc\(doc\(db, 'contacts', id\)\);\s+alert\('নাম্বার মুছে ফেলা হয়েছে'\);\s+\} catch \(err\) \{\s+console\.error\(err\);\s+alert\('ত্রুটি হয়েছে'\);\s+\}\s+\};/g,
      `const handleDeleteContactApp = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
          try {
            await deleteDoc(doc(db, 'contacts', id));
          } catch (err) {
            console.error(err);
          }
        });
      };`
    );
  }
  
  fs.writeFileSync('src/App.tsx', code);
}

function fixCommunity() {
  let code = fs.readFileSync('src/Community.tsx', 'utf8');
  if (!code.includes("import { ConfirmDialog }")) {
    code = code.replace("import { collection", "import { ConfirmDialog } from './components/ConfirmDialog';\nimport { collection");
  }

  if (!code.includes("const [confirmConfig")) {
    const targetState = `  const [editPostText, setEditPostText] = useState('');`;
    const replaceState = `  const [editPostText, setEditPostText] = useState('');
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
    code = code.replace(targetState, replaceState);
  }
  
  if (code.includes("if (!window.confirm")) {
    // Replace handleDeletePost
    code = code.replace(
      /const handleDeletePost = async \(postId: string\) => \{\s+if \(!window\.confirm\('পোস্টটি মুছে ফেলতে চান\?'\)\) \{\s+await updateDoc\(doc\(db, 'community_posts', postId\), \{\s+isDeleted: true,\s+deletedAt: new Date\(\)\.toISOString\(\)\s+\}\);\s+\}\s+\};/g,
      `const handleDeletePost = (postId: string) => {
        confirmAction('পোস্টটি মুছে ফেলতে চান?', async () => {
          await updateDoc(doc(db, 'community_posts', postId), { 
            isDeleted: true, 
            deletedAt: new Date().toISOString() 
          });
        });
      };`
    );

    // Replace handleDeleteComment
    code = code.replace(
      /const handleDeleteComment = async \(postId: string, commentId: string\) => \{\s+if \(!window\.confirm\('মন্তব্যটি মুছে ফেলতে চান\?'\)\) \{\s+const postRef = doc\(db, 'community_posts', postId\);\s+const postDoc = await getDoc\(postRef\);\s+if\(postDoc\.exists\(\)\) \{\s+const comments = postDoc\.data\(\)\.comments \|\| \[\];\s+await updateDoc\(postRef, \{ comments: comments\.map\(\(c: any\) => c\.id === commentId \? \{ \.\.\.c, isDeleted: true, deletedAt: new Date\(\)\.toISOString\(\) \} : c\) \}\);\s+\}\s+\}\s+\};/g,
      `const handleDeleteComment = (postId: string, commentId: string) => {
        confirmAction('মন্তব্যটি মুছে ফেলতে চান?', async () => {
          const postRef = doc(db, 'community_posts', postId);
          const postDoc = await getDoc(postRef);
          if(postDoc.exists()) {
            const comments = postDoc.data().comments || [];
            await updateDoc(postRef, { comments: comments.map((c: any) => c.id === commentId ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() } : c) });
          }
        });
      };`
    );
  }

  fs.writeFileSync('src/Community.tsx', code);
}

fixApp();
fixCommunity();
