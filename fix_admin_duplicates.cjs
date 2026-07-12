const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes('import DuplicatesTab from')) {
  code = code.replace(
    "import DataManagementTab from './components/DataManagementTab';",
    "import DataManagementTab from './components/DataManagementTab';\nimport DuplicatesTab from './components/DuplicatesTab';"
  );
}

const activeTabReplaceStr = "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data' | 'duplicates'>('requests');";
if (code.includes("const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>('requests');")) {
  code = code.replace("const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>('requests');", activeTabReplaceStr);
}

const navTabTarget = `<button onClick={() => setActiveTab('data')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'data' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            ডেটা ম্যানেজমেন্ট
          </button>`;

const navTabReplace = `<button onClick={() => setActiveTab('data')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'data' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            ডেটা ম্যানেজমেন্ট
          </button>
          <button onClick={() => setActiveTab('duplicates')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'duplicates' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            ডুপলিকেট
          </button>`;

if (code.includes(navTabTarget)) {
  code = code.replace(navTabTarget, navTabReplace);
}

const renderTabTarget = `{activeTab === 'data' && (
          <DataManagementTab />
        )}`;

const renderTabReplace = `{activeTab === 'data' && (
          <DataManagementTab />
        )}
        {activeTab === 'duplicates' && (
          <DuplicatesTab />
        )}`;

if (code.includes(renderTabTarget)) {
  code = code.replace(renderTabTarget, renderTabReplace);
}

fs.writeFileSync('src/Admin.tsx', code);
