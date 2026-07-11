const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add edit category states and functions
code = code.replace(
  "const [newCatEnglish, setNewCatEnglish] = useState('');",
  "const [newCatEnglish, setNewCatEnglish] = useState('');\n  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);"
);

const handleCategoryEditTarget = `  const handleCategorySubmit = async (e: React.FormEvent) => {`;
const handleCategoryEditReplace = `  const openEditCategoryModal = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setNewCatTitle(category.title);
    setNewCatEnglish(category.englishTitle || '');
    setNewCatIcon(category.iconName || 'Building2');
    setEditingCategoryId(category.id);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {`;
code = code.replace(handleCategoryEditTarget, handleCategoryEditReplace);

const catSubmitTarget = `      await addDoc(collection(db, 'categories'), {
        title: newCatTitle,
        englishTitle: newCatEnglish,
        iconName: newCatIcon,
        color: newCatColor,
        status: isAdmin ? 'approved' : 'pending'
      });
      
      setRequestStatus('success');`;

const catSubmitReplace = `      if (editingCategoryId) {
        await updateDoc(doc(db, 'categories', editingCategoryId), {
          title: newCatTitle,
          englishTitle: newCatEnglish,
          iconName: newCatIcon,
          color: newCatColor,
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          title: newCatTitle,
          englishTitle: newCatEnglish,
          iconName: newCatIcon,
          color: newCatColor,
          status: isAdmin ? 'approved' : 'pending'
        });
      }
      
      setRequestStatus('success');`;
code = code.replace(catSubmitTarget, catSubmitReplace);

code = code.replace(
  "setNewCatIcon('Building2');\n      }, 2000);",
  "setNewCatIcon('Building2');\n        setEditingCategoryId(null);\n      }, 2000);"
);

const closeCategoryModalTarget = `                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"`;
const closeCategoryModalReplace = `                onClick={() => { setIsCategoryModalOpen(false); setEditingCategoryId(null); }}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"`;
code = code.replace(closeCategoryModalTarget, closeCategoryModalReplace);

// Add edit button to categories
const catRenderTarget = `                  {isAdmin && !['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                    <button 
                      onClick={(e) => handleDeleteCategoryApp(category.id, e)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}`;

const catRenderReplace = `                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                        <button 
                          onClick={(e) => openEditCategoryModal(e, category)}
                          className="bg-blue-500 text-white p-1.5 rounded-full"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {!['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                        <button 
                          onClick={(e) => handleDeleteCategoryApp(category.id, e)}
                          className="bg-red-500 text-white p-1.5 rounded-full"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}`;
code = code.replace(catRenderTarget, catRenderReplace);

// Fix the request messages for contact and category modal
const contactSuccessTarget = `              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">রিকোয়েস্ট সফল হয়েছে!</h3>
                  <p className="text-gray-500">আপনার দেওয়া তথ্যটি যাচাই করে শীঘ্রই ডিরেক্টরিতে যুক্ত করা হবে।</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">`;

const contactSuccessReplace = `              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{isAdmin ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'রিকোয়েস্ট সফল হয়েছে!'}</h3>
                  <p className="text-gray-500">{isAdmin ? 'আপনার দেওয়া তথ্যটি সাথে সাথে আপডেট হয়ে গেছে।' : 'আপনার দেওয়া তথ্যটি যাচাই করে শীঘ্রই ডিরেক্টরিতে যুক্ত করা হবে।'}</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">`;
code = code.replace(contactSuccessTarget, contactSuccessReplace);

const categorySuccessTarget = `              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">রিকোয়েস্ট সফল হয়েছে!</h3>
                  <p className="text-gray-500">অ্যাডমিন চেক করে ক্যাটাগরিটি যুক্ত করবেন।</p>
                </div>
              ) : (
                <form onSubmit={handleCategorySubmit} className="space-y-4">`;

const categorySuccessReplace = `              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{isAdmin ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'রিকোয়েস্ট সফল হয়েছে!'}</h3>
                  <p className="text-gray-500">{isAdmin ? 'আপনার দেওয়া তথ্যটি সাথে সাথে আপডেট হয়ে গেছে।' : 'অ্যাডমিন চেক করে ক্যাটাগরিটি যুক্ত করবেন।'}</p>
                </div>
              ) : (
                <form onSubmit={handleCategorySubmit} className="space-y-4">`;
code = code.replace(categorySuccessTarget, categorySuccessReplace);

// Change button text when admin
const contactBtnTarget = `{requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : 'রিকোয়েস্ট পাঠান'}`;
const contactBtnReplace = `{requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : isAdmin ? (editingContactId ? 'আপডেট করুন' : 'যুক্ত করুন') : 'রিকোয়েস্ট পাঠান'}`;
code = code.replace(contactBtnTarget, contactBtnReplace);

const categoryBtnTarget = `{requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : 'রিকোয়েস্ট পাঠান'}`;
const categoryBtnReplace = `{requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : isAdmin ? (editingCategoryId ? 'আপডেট করুন' : 'যুক্ত করুন') : 'রিকোয়েস্ট পাঠান'}`;
code = code.replace(categoryBtnTarget, categoryBtnReplace);


// Update category modal title
code = code.replace(
  '<h2 className="text-lg font-semibold text-gray-900">নতুন ক্যাটাগরি (মেনু) যুক্ত করুন</h2>',
  '<h2 className="text-lg font-semibold text-gray-900">{editingCategoryId ? "ক্যাটাগরি আপডেট করুন" : "নতুন ক্যাটাগরি (মেনু) যুক্ত করুন"}</h2>'
);

// Update contact modal title
const contactModalTitleTarget = `            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">নতুন নাম্বার যুক্ত করতে রিকোয়েস্ট করুন</h2>`;
const contactModalTitleReplace = `            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{isAdmin ? (editingContactId ? "নাম্বার আপডেট করুন" : "নতুন নাম্বার যুক্ত করুন") : "নতুন নাম্বার যুক্ত করতে রিকোয়েস্ট করুন"}</h2>`;
code = code.replace(contactModalTitleTarget, contactModalTitleReplace);

fs.writeFileSync('src/App.tsx', code);
