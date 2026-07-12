const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);",
  "const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);\n  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);"
);
code = code.replace(
  "const [newCatTitle, setNewCatTitle] = useState('');",
  "const [newSubCatTitle, setNewSubCatTitle] = useState('');\n  const [newSubCatParentId, setNewSubCatParentId] = useState('');\n  const [dynamicSubCategories, setDynamicSubCategories] = useState<any[]>([]);\n  const [newCatTitle, setNewCatTitle] = useState('');"
);

// 2. Fetch dynamic subcategories
const fetchTarget = `const qCategories = query(collection(db, 'categories'), orderBy('order'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {`;
const fetchReplace = `const qSubCategories = query(collection(db, 'subcategories'));
    const unsubSubCategories = onSnapshot(qSubCategories, (snapshot) => {
      const subCats: any[] = [];
      snapshot.forEach((doc) => {
        subCats.push({ id: doc.id, ...doc.data() });
      });
      setDynamicSubCategories(subCats);
    });

    const qCategories = query(collection(db, 'categories'), orderBy('order'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {`;
code = code.replace(fetchTarget, fetchReplace);

// 3. Unsubscribe
const unsubTarget = `unsubCategories();
      unsubContacts();`;
const unsubReplace = `unsubCategories();
      unsubContacts();
      unsubSubCategories();`;
code = code.replace(unsubTarget, unsubReplace);

// 4. Submission logic
const submitTarget = `const openNewCatModal = () => {`;
const submitReplace = `const handleSubCategorySubmit = async (e: React.FormEvent) => {
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

  const openNewCatModal = () => {`;
code = code.replace(submitTarget, submitReplace);

// 5. Floating button
const floatingTarget = `<button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>`;
const floatingReplace = `<button
          onClick={() => setIsSubCategoryModalOpen(true)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new sub-category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন সাব-ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>`;
code = code.replace(floatingTarget, floatingReplace);

// 6. Modal UI
const modalTarget = `{/* Request Category Modal */}`;
const modalReplace = `{/* Request Sub Category Modal */}
      {isSubCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">নতুন সাব-ক্যাটাগরি যুক্ত করুন</h2>
              <button
                onClick={() => setIsSubCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5">
              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-orange-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{isAdmin ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'রিকোয়েস্ট সফল হয়েছে!'}</h3>
                  <p className="text-gray-500">{isAdmin ? 'আপনার দেওয়া তথ্যটি সাথে সাথে আপডেট হয়ে গেছে।' : 'অ্যাডমিন চেক করে সাব-ক্যাটাগরিটি যুক্ত করবেন।'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">প্যারেন্ট ক্যাটাগরি *</label>
                    <select
                      required value={newSubCatParentId} onChange={(e) => setNewSubCatParentId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সাব-ক্যাটাগরির নাম *</label>
                    <input
                      type="text" required value={newSubCatTitle} onChange={(e) => setNewSubCatTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="যেমন: ফায়ার সার্ভিস"
                    />
                  </div>
                  
                  <button
                    type="submit" disabled={requestStatus === 'submitting'}
                    className={\`w-full py-3 px-4 rounded-xl text-white font-medium flex justify-center items-center transition-colors \${
                      requestStatus === 'submitting' ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                    }\`}
                  >
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : isAdmin ? 'যুক্ত করুন' : 'রিকোয়েস্ট পাঠান'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Category Modal */}`;
code = code.replace(modalTarget, modalReplace);

// 7. Map rendering logic for sub-categories
const renderTarget = `{Object.keys(
              filteredContacts.reduce((acc, contact) => {
                const sub = contact.subCategory || 'অন্যান্য';
                if (!acc[sub]) acc[sub] = [];
                acc[sub].push(contact);
                return acc;
              }, {} as Record<string, typeof filteredContacts>)
            ).map((subCat) => {`;

const renderReplace = `{Array.from(new Set([
              ...filteredContacts.reduce((acc, contact) => {
                const sub = contact.subCategory || 'অন্যান্য';
                acc.push(sub);
                return acc;
              }, [] as string[]),
              ...dynamicSubCategories.filter(sc => sc.categoryId === selectedCategory.id && sc.status === 'approved').map(sc => sc.title)
            ])).map((subCat) => {`;
code = code.replace(renderTarget, renderReplace);

fs.writeFileSync('src/App.tsx', code);
