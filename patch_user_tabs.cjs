const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `  const [isEditProfileMode, setIsEditProfileMode] = useState(!localStorage.getItem('contributorName'));`;
const rep1 = `  const [isEditProfileMode, setIsEditProfileMode] = useState(!localStorage.getItem('contributorName'));
  const [activeUserTab, setActiveUserTab] = useState<'stats' | 'contacts' | 'feedbacks' | 'messages'>('stats');`;

code = code.replace(target1, rep1);

const target2 = `              ) : contributorName && !isEditProfileMode ? (
                <>
                  {!hasPassword && (`;
const rep2 = `              ) : contributorName && !isEditProfileMode ? (
                <>
                  {!hasPassword && (`;

// Since there is a lot of code, I will use regex to wrap the sections.
// But first I will replace the tab headers just below the hasPassword section.
const target3 = `                      <p className="mt-1 text-xs opacity-90">আপনার একাউন্টটি সুরক্ষিত রাখতে এখনই প্রোফাইল আপডেট করে একটি পাসওয়ার্ড সেট করে নিন।</p>
                    </div>
                  )}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">`;
const rep3 = `                      <p className="mt-1 text-xs opacity-90">আপনার একাউন্টটি সুরক্ষিত রাখতে এখনই প্রোফাইল আপডেট করে একটি পাসওয়ার্ড সেট করে নিন।</p>
                    </div>
                  )}
                  
                  {/* User Dashboard Tabs */}
                  <div className="flex overflow-x-auto gap-2 mb-4 pb-1 scrollbar-hide border-b">
                    <button onClick={() => setActiveUserTab('stats')} className={\`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors \${activeUserTab === 'stats' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                      ড্যাশবোর্ড
                    </button>
                    <button onClick={() => setActiveUserTab('contacts')} className={\`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors \${activeUserTab === 'contacts' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                      নাম্বার ({contributorContacts.length})
                    </button>
                    <button onClick={() => setActiveUserTab('feedbacks')} className={\`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors \${activeUserTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                      মতামত ({contributorFeedbacks.length})
                    </button>
                    <button onClick={() => setActiveUserTab('messages')} className={\`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors \${activeUserTab === 'messages' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
                      ইনবক্স {hasUnreadMessages || hasUnreadReply ? <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1"></span> : ''}
                    </button>
                  </div>

                  {activeUserTab === 'stats' && (
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">`;
code = code.replace(target3, rep3);

const target4 = `                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার মতামত ও আইডিয়া</h3>`;
const rep4 = `                  </div>
                  )}

                  {activeUserTab === 'feedbacks' && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার মতামত ও আইডিয়া</h3>`;
code = code.replace(target4, rep4);

const target5 = `                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">অ্যাডমিন থেকে ম্যাসেজ</h3>`;
const rep5 = `                        ))}
                      </div>
                    )}
                  </div>
                  )}

                  {activeUserTab === 'messages' && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">অ্যাডমিন থেকে ম্যাসেজ</h3>`;
code = code.replace(target5, rep5);

const target6 = `                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>`;
const rep6 = `                      </button>
                    </div>
                  </div>
                  )}

                  {activeUserTab === 'contacts' && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>`;
code = code.replace(target6, rep6);

const target7 = `                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">`;
const rep7 = `                        ))}
                      </div>
                    )}
                  </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">`;
code = code.replace(target7, rep7);

fs.writeFileSync(file, code);
console.log('patched');
