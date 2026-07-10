const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

code = code.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { ConfirmDialog } from './components/ConfirmDialog';");
if (!code.includes("import { ConfirmDialog }")) {
  code = code.replace("import { collection", "import { ConfirmDialog } from './components/ConfirmDialog';\nimport { collection");
}

const targetState = `  const [editPostText, setEditPostText] = useState('');`;
const replaceState = `  const [editPostText, setEditPostText] = useState('');
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
code = code.replace(targetState, replaceState);

// Replace handleDeletePost
code = code.replace(
  /const handleDeletePost = async \(postId: string\) => \{\s+if \(window\.confirm\('পোস্টটি মুছে ফেলতে চান\?'\)\) \{\s+await updateDoc\(doc\(db, 'community_posts', postId\), \{\s+isDeleted: true,\s+deletedAt: new Date\(\)\.toISOString\(\)\s+\}\);\s+\}\s+\};/g,
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
  /const handleDeleteComment = async \(postId: string, commentId: string\) => \{\s+if \(window\.confirm\('মন্তব্যটি মুছে ফেলতে চান\?'\)\) \{\s+const postRef = doc\(db, 'community_posts', postId\);\s+const postDoc = await getDoc\(postRef\);\s+if\(postDoc\.exists\(\)\) \{\s+const comments = postDoc\.data\(\)\.comments \|\| \[\];\s+await updateDoc\(postRef, \{ comments: comments\.map\(\(c: any\) => c\.id === commentId \? \{ \.\.\.c, isDeleted: true, deletedAt: new Date\(\)\.toISOString\(\) \} : c\) \}\);\s+\}\s+\}\s+\};/g,
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

// Add the ConfirmDialog component to render
const targetRender = `return (
    <div className="bg-white min-h-screen">`;
const replaceRender = `return (
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
      <div className="bg-white min-h-screen">`;
code = code.replace(targetRender, replaceRender);

code = code.replace(/(<\/div>\s*\);\s*\})/g, "</div>\n    </>\n  );\n}");

fs.writeFileSync('src/Community.tsx', code);
