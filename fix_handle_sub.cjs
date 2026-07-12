const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      if (isAdmin) {
        await addDoc(collection(db, 'subcategories'), {
          title: newSubCatTitle,
          categoryId: newSubCatParentId,
          status: 'approved',
          createdAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'subcategories'), {
          title: newSubCatTitle,
          categoryId: newSubCatParentId,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: 'admin',
          type: 'subcategory_request',
          title: 'নতুন সাব-ক্যাটাগরি রিকোয়েস্ট',
          body: newSubCatTitle,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'requests'
        });
      }
      
      setRequestStatus('success');
      setTimeout(() => {
        setIsSubCategoryModalOpen(false);
        setRequestStatus('idle');
        setNewSubCatTitle('');
        setNewSubCatParentId('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setRequestStatus('idle');
    }
  };

  const handleCategorySubmit`;

code = code.replace("const handleCategorySubmit", replacement);
fs.writeFileSync('src/App.tsx', code);
