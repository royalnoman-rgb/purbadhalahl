const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `  const [contributors, setContributors] = useState<any[]>([]);`;
const rep1 = `  const [contributors, setContributors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history'>('requests');`;

code = code.replace(target1, rep1);

const target2 = `      <main className="max-w-4xl mx-auto p-4 space-y-8 mt-6">
        
        {/* Pending Categories */}`;
const rep2 = `      <main className="max-w-4xl mx-auto p-4 mt-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide border-b">
          <button onClick={() => setActiveTab('requests')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'requests' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অপেক্ষমান রিকোয়েস্ট ({pendingContacts.length + pendingCategories.length})
          </button>
          <button onClick={() => setActiveTab('feedbacks')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            মতামত ({feedbacks.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিভিউ ({publicReviews.length})
          </button>
          <button onClick={() => setActiveTab('contributors')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'contributors' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অবদানকারী
          </button>
          <button onClick={() => setActiveTab('history')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            অ্যাডমিন হিস্ট্রি
          </button>
        </div>

        <div className="space-y-8">
        
        {/* Pending Categories */}
        {activeTab === 'requests' && (
          <section>`;

code = code.replace(target2, rep2);

const target3 = `        </section>

        {/* Pending Contacts */}`;
const rep3 = `        </section>
        )}

        {/* Pending Contacts */}
        {activeTab === 'requests' && (`;

code = code.replace(target3, rep3);

const target4 = `        </section>

        {/* Feedbacks */}`;
const rep4 = `        </section>
        )}

        {/* Feedbacks */}
        {activeTab === 'feedbacks' && (`;

code = code.replace(target4, rep4);

const target5 = `        </section>

        {/* Reviews */}`;
const rep5 = `        </section>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (`;

code = code.replace(target5, rep5);

const target6 = `        </section>

        {/* Contributors Messages */}`;
const rep6 = `        </section>
        )}

        {/* Contributors Messages */}
        {activeTab === 'contributors' && (`;

code = code.replace(target6, rep6);

const target7 = `        </section>

        {/* Admin History */}`;
const rep7 = `        </section>
        )}

        {/* Admin History */}
        {activeTab === 'history' && (`;

code = code.replace(target7, rep7);

const target8 = `        </section>
      </main>
    </div>`;
const rep8 = `        </section>
        )}
        </div>
      </main>
    </div>`;

code = code.replace(target8, rep8);

fs.writeFileSync(file, code);
