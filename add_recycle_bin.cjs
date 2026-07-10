const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetState = `  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history'>('requests');`;
const replaceState = `  const [deletedPosts, setDeletedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle'>('requests');`;

code = code.replace(targetState, replaceState);

const targetFetch = `      const categoriesSnapshot = await getDocs(categoriesQuery);
      setPendingCategories(categoriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));`;
const replaceFetch = `      const categoriesSnapshot = await getDocs(categoriesQuery);
      setPendingCategories(categoriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const deletedPostsQuery = query(collection(db, 'community_posts'), where('isDeleted', '==', true));
      const deletedPostsSnapshot = await getDocs(deletedPostsQuery);
      setDeletedPosts(deletedPostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));`;

code = code.replace(targetFetch, replaceFetch);

const targetTab = `<button onClick={() => setActiveTab('history')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অ্যাডমিন হিস্ট্রি
          </button>`;
const replaceTab = `<button onClick={() => setActiveTab('history')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অ্যাডমিন হিস্ট্রি
          </button>
          <button onClick={() => setActiveTab('recycle')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিসাইকেল বিন ({deletedPosts.length})
          </button>`;

code = code.replace(targetTab, replaceTab);

// Now for restoring post:
const restoreFunction = `
  const handleRestorePost = async (id: string) => {
    await updateDoc(doc(db, 'community_posts', id), {
      isDeleted: false,
      deletedAt: null
    });
    await logAdminAction(\`Post restored (ID: \${id})\`);
    fetchData();
  };
  
  const handlePermanentDeletePost = async (id: string) => {
    if (window.confirm('পোস্টটি চিরতরে মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'community_posts', id));
      await logAdminAction(\`Post permanently deleted (ID: \${id})\`);
      fetchData();
    }
  };
`;

code = code.replace("  const handleDeletePublicReview", restoreFunction + "\n  const handleDeletePublicReview");

// Render the recycle bin section
const recycleSection = `        {/* Recycle Bin */}
        {activeTab === 'recycle' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">রিসাইকেল বিন (মুছে ফেলা পোস্টসমূহ) - {deletedPosts.length}</h2>
          {deletedPosts.length === 0 ? <p className="text-gray-500">রিসাইকেল বিনে কোনো পোস্ট নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {deletedPosts.map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{post.authorName}</p>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{post.text}</p>
                    <p className="text-xs text-gray-400 mt-2">মুছে ফেলা হয়েছে: {new Date(post.deletedAt).toLocaleString('bn-BD')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRestorePost(post.id)}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-200"
                    >
                      রিস্টোর
                    </button>
                    <button 
                      onClick={() => handlePermanentDeletePost(post.id)}
                      className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}`;

code = code.replace(`        {/* Admin History */}`, recycleSection + "\n\n        {/* Admin History */}");

fs.writeFileSync('src/Admin.tsx', code);
