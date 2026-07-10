const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import Admin from './Admin';", "import Admin from './Admin';\nimport { ConfirmDialog } from './components/ConfirmDialog';");

const targetState = `  const [feedbacks, setFeedbacks] = useState<any[]>([]);`;
const replaceState = `  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
code = code.replace(targetState, replaceState);

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

// Add the ConfirmDialog component to render
const targetRender = `<div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0">`;
const replaceRender = `
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
      <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0">`;
code = code.replace(targetRender, replaceRender);

// Also wrap the whole return in a fragment, or close it at the very bottom
// App returns <div className="min-h-screen...
// Let's find the closing tag for it. It's the last </div> before }
code = code.replace(/    <\/div>\n  \);\n\}\n/g, "    </div>\n    </>\n  );\n}\n");
// In case the trailing spaces are different, let's use a safer regex:
// It's the final return of App.
const parts = code.split('export default function App');
const part2 = parts[1].replace(/(<\/div>\s*\);\s*\})/g, "</div>\n    </>\n  );\n}");
code = parts[0] + 'export default function App' + part2;

fs.writeFileSync('src/App.tsx', code);
