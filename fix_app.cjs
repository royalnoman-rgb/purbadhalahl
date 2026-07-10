const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCat = `  const handleDeleteCategoryApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await deleteDoc(doc(db, 'categories', id));
        alert('ক্যাটাগরি মুছে ফেলা হয়েছে'); catch (err) {
        console.error(err);
        alert('ত্রুটি হয়েছে');
      }
    }
  };`;
const replaceCat = `  const handleDeleteCategoryApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'categories', id));
      alert('ক্যাটাগরি মুছে ফেলা হয়েছে');
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে');
    }
  };`;
code = code.replace(targetCat, replaceCat);

const targetBan = `  const handleBanContributorApp = async (id: string, isCurrentlyBanned: boolean) => {
    try {
        await updateDoc(doc(db, 'contributors', id), { isBanned: !isCurrentlyBanned);
        alert(isCurrentlyBanned ? 'ব্যান তুলে নেওয়া হয়েছে' : 'ইউজার ব্যান করা হয়েছে');
      } catch (e) {
        console.error(e);
      }
    }
  };`;
const replaceBan = `  const handleBanContributorApp = async (id: string, isCurrentlyBanned: boolean) => {
    try {
      await updateDoc(doc(db, 'contributors', id), { isBanned: !isCurrentlyBanned });
      alert(isCurrentlyBanned ? 'ব্যান তুলে নেওয়া হয়েছে' : 'ইউজার ব্যান করা হয়েছে');
    } catch (e) {
      console.error(e);
    }
  };`;
code = code.replace(targetBan, replaceBan);

const targetCon = `  const handleDeleteContactApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await deleteDoc(doc(db, 'contacts', id));
        alert('নাম্বার মুছে ফেলা হয়েছে'); catch (err) {
        console.error(err);
        alert('ত্রুটি হয়েছে');
      }
    }
  };`;
const replaceCon = `  const handleDeleteContactApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'contacts', id));
      alert('নাম্বার মুছে ফেলা হয়েছে');
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে');
    }
  };`;
code = code.replace(targetCon, replaceCon);

fs.writeFileSync('src/App.tsx', code);
