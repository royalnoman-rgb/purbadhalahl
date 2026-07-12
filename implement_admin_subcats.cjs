const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

// Add pendingSubCategories state
code = code.replace(
  "const [pendingCategories, setPendingCategories] = useState<any[]>([]);",
  "const [pendingCategories, setPendingCategories] = useState<any[]>([]);\n  const [pendingSubCategories, setPendingSubCategories] = useState<any[]>([]);"
);

// Fetch pendingSubCategories
const fetchCategoriesTarget = `const qCategories = query(collection(db, 'categories'), where('status', '==', 'pending'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {`;
const fetchCategoriesReplace = `const qSubCategories = query(collection(db, 'subcategories'), where('status', '==', 'pending'));
    const unsubSubCategories = onSnapshot(qSubCategories, (snapshot) => {
      const subCats: any[] = [];
      snapshot.forEach(doc => subCats.push({ id: doc.id, ...doc.data() }));
      setPendingSubCategories(subCats);
    });
    
    const qCategories = query(collection(db, 'categories'), where('status', '==', 'pending'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {`;
code = code.replace(fetchCategoriesTarget, fetchCategoriesReplace);

// Unsubscribe
code = code.replace(
  "unsubCategories();\n      unsubFeedbacks();",
  "unsubCategories();\n      unsubSubCategories();\n      unsubFeedbacks();"
);

// Update Request Count in UI
code = code.replace(
  "অপেক্ষমান রিকোয়েস্ট ({pendingContacts.length + pendingCategories.length})",
  "অপেক্ষমান রিকোয়েস্ট ({pendingContacts.length + pendingCategories.length + pendingSubCategories.length})"
);

// handleApproveSubCategory
const approveTarget = `const handleApproveCategory = async (id: string) => {`;
const approveReplace = `const handleApproveSubCategory = async (id: string) => {
    try {
      await updateDoc(doc(db, 'subcategories', id), { status: 'approved' });
      alert('Approved successfully!');
    } catch(e) { console.error(e); }
  };
  const handleDeleteSubCategory = async (id: string) => {
    if(window.confirm('Delete this subcategory request?')) {
      await deleteDoc(doc(db, 'subcategories', id));
    }
  };
  const handleApproveCategory = async (id: string) => {`;
code = code.replace(approveTarget, approveReplace);

// handleEditRequestSave support for subcategories
code = code.replace(
  "const collectionName = type === 'contact' ? 'contacts' : 'categories';",
  "const collectionName = type === 'contact' ? 'contacts' : type === 'subcategory' ? 'subcategories' : 'categories';"
);

// Render pendingSubCategories
const renderTarget = `</section>
        )}

        {activeTab === 'feedbacks' && (`;
const renderReplace = `
          <h2 className="text-lg font-semibold mt-8 mb-4 border-b pb-2">অপেক্ষমান সাব-ক্যাটাগরি - {pendingSubCategories.length}</h2>
          {pendingSubCategories.length === 0 ? <p className="text-gray-500">কোনো অপেক্ষমান সাব-ক্যাটাগরি নেই।</p> : (
            <div className="grid gap-4 max-h-[40vh] overflow-y-auto pr-2 pb-2">
              {pendingSubCategories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                  {editingRequestId === cat.id ? (
                      <div className="space-y-2 w-full">
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.title || ''} onChange={e => setEditRequestData({...editRequestData, title: e.target.value})} placeholder="Title" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.categoryId || ''} onChange={e => setEditRequestData({...editRequestData, categoryId: e.target.value})} placeholder="Parent Category ID" />
                        <div className="flex gap-2">
                          <button onClick={() => handleEditRequestSave(cat.id, 'subcategory')} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Save</button>
                          <button onClick={() => setEditingRequestId(null)} className="text-xs bg-gray-300 px-2 py-1 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between w-full">
                        <div>
                          <h3 className="font-bold text-gray-900">{cat.title}</h3>
                          <p className="text-sm text-gray-600">Parent Category: {cat.categoryId}</p>
                        </div>
                        <div className="flex gap-1 h-fit">
                          <button onClick={() => { setEditingRequestId(cat.id); setEditRequestData(cat); }} className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleApproveSubCategory(cat.id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSubCategory(cat.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
</section>
        )}

        {activeTab === 'feedbacks' && (`;

code = code.replace(renderTarget, renderReplace);

fs.writeFileSync('src/Admin.tsx', code);
