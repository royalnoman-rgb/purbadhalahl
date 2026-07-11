const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const stateTarget = `  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle'>('requests');`;

const stateReplace = `  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle'>('requests');
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editRequestData, setEditRequestData] = useState<any>({});
  
  const [replyingToRequest, setReplyingToRequest] = useState<string | null>(null);
  const [requestReplyText, setRequestReplyText] = useState('');
  
  const handleEditRequestSave = async (id: string, type: 'contact' | 'category') => {
    try {
      const collectionName = type === 'contact' ? 'contacts' : 'categories';
      await updateDoc(doc(db, collectionName, id), editRequestData);
      setEditingRequestId(null);
      fetchData();
    } catch (e) { console.error(e); }
  };
  
  const handleReplyToRequest = async (contributorPhone: string, requestId: string) => {
    if (!requestReplyText.trim()) return;
    try {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const contributorData = contributorDoc.data();
        const newMessages = [...(contributorData.messages || []), {
          id: Date.now().toString(),
          sender: 'admin',
          message: requestReplyText.trim(),
          createdAt: new Date().toISOString()
        }];
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });
        setReplyingToRequest(null);
        setRequestReplyText('');
        alert('ম্যাসেজ সফলভাবে পাঠানো হয়েছে!');
      } else {
        alert('কন্ট্রিবিউটর পাওয়া যায়নি!');
      }
    } catch (e) { console.error(e); }
  };
`;
code = code.replace(stateTarget, stateReplace);

const pendingContactTarget = `                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{contact.name}</h3>
                      {contact.replacesId && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">সংশোধন রিকোয়েস্ট</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{contact.phone}</p>
                    <p className="text-sm text-gray-500">{contact.details} - {contact.subDetails}</p>
                    <p className="text-xs text-emerald-600 mt-1">Category: {contact.categoryId}</p>
                    {contact.contributorName && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                        <p className="text-gray-500 font-medium mb-1">প্রেরক:</p>
                        <p className="text-gray-800">{contact.contributorName} ({contact.contributorPhone})</p>
                        {contact.contributorFacebook && (
                          <a href={contact.contributorFacebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveContact(contact.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>`;

const pendingContactReplace = `                    {editingRequestId === contact.id ? (
                      <div className="space-y-2 w-full">
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.name || ''} onChange={e => setEditRequestData({...editRequestData, name: e.target.value})} placeholder="Name" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.phone || ''} onChange={e => setEditRequestData({...editRequestData, phone: e.target.value})} placeholder="Phone" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.details || ''} onChange={e => setEditRequestData({...editRequestData, details: e.target.value})} placeholder="Details" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.subDetails || ''} onChange={e => setEditRequestData({...editRequestData, subDetails: e.target.value})} placeholder="Sub Details" />
                        <div className="flex gap-2">
                          <button onClick={() => handleEditRequestSave(contact.id, 'contact')} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Save</button>
                          <button onClick={() => setEditingRequestId(null)} className="text-xs bg-gray-300 px-2 py-1 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex justify-between w-full">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{contact.name}</h3>
                                {contact.replacesId && (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">সংশোধন রিকোয়েস্ট</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-700">{contact.phone}</p>
                              <p className="text-sm text-gray-500">{contact.details} - {contact.subDetails}</p>
                              <p className="text-xs text-emerald-600 mt-1">Category: {contact.categoryId}</p>
                            </div>
                            <div className="flex gap-1 h-fit">
                              <button onClick={() => { setEditingRequestId(contact.id); setEditRequestData(contact); }} className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Edit">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleApproveContact(contact.id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {contact.contributorName && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs w-full">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-gray-500 font-medium">প্রেরক: <span className="text-gray-800">{contact.contributorName} ({contact.contributorPhone})</span></p>
                                <button onClick={() => setReplyingToRequest(replyingToRequest === contact.id ? null : contact.id)} className="text-emerald-600 hover:underline">
                                  রিপ্লাই দিন
                                </button>
                              </div>
                              {replyingToRequest === contact.id && (
                                <div className="mt-2 flex gap-2">
                                  <input type="text" value={requestReplyText} onChange={e => setRequestReplyText(e.target.value)} placeholder="রিপ্লাই লিখুন..." className="flex-1 px-2 py-1 border rounded" />
                                  <button onClick={() => handleReplyToRequest(contact.contributorPhone, contact.id)} className="bg-emerald-600 text-white px-3 py-1 rounded">Send</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>`;
code = code.replace(pendingContactTarget, pendingContactReplace);

const pendingCategoryTarget = `                    <h3 className="font-bold text-gray-900">{cat.title} ({cat.englishTitle})</h3>
                    <p className="text-sm text-gray-600">Icon: {cat.iconName} | Color: {cat.color}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveCategory(cat.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>`;

const pendingCategoryReplace = `                    {editingRequestId === cat.id ? (
                      <div className="space-y-2 w-full">
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.title || ''} onChange={e => setEditRequestData({...editRequestData, title: e.target.value})} placeholder="Title (বাংলা)" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.englishTitle || ''} onChange={e => setEditRequestData({...editRequestData, englishTitle: e.target.value})} placeholder="Title (English)" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.iconName || ''} onChange={e => setEditRequestData({...editRequestData, iconName: e.target.value})} placeholder="Icon" />
                        <div className="flex gap-2">
                          <button onClick={() => handleEditRequestSave(cat.id, 'category')} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Save</button>
                          <button onClick={() => setEditingRequestId(null)} className="text-xs bg-gray-300 px-2 py-1 rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between w-full">
                        <div>
                          <h3 className="font-bold text-gray-900">{cat.title} ({cat.englishTitle})</h3>
                          <p className="text-sm text-gray-600">Icon: {cat.iconName} | Color: {cat.color}</p>
                        </div>
                        <div className="flex gap-1 h-fit">
                          <button onClick={() => { setEditingRequestId(cat.id); setEditRequestData(cat); }} className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleApproveCategory(cat.id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>`;
code = code.replace(pendingCategoryTarget, pendingCategoryReplace);

fs.writeFileSync('src/Admin.tsx', code);
