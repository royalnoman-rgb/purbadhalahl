const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const adminFunctions = `
  const handleDeleteCategoryApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('ক্যাটাগরিটি মুছে ফেলতে চান?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        alert('ক্যাটাগরি মুছে ফেলা হয়েছে');
      } catch (err) {
        console.error(err);
        alert('ত্রুটি হয়েছে');
      }
    }
  };

  const handleDeleteContactApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('নাম্বারটি মুছে ফেলতে চান?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        alert('নাম্বার মুছে ফেলা হয়েছে');
      } catch (err) {
        console.error(err);
        alert('ত্রুটি হয়েছে');
      }
    }
  };
`;

code = code.replace(
  `  const handleFeedbackSubmit = async (e: React.FormEvent) => {`,
  `${adminFunctions}\n  const handleFeedbackSubmit = async (e: React.FormEvent) => {`
);

fs.writeFileSync(file, code);
