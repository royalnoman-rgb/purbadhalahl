const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import DataManagementTab from './components/DataManagementTab';")) {
  code = code.replace("import EmojiPicker from 'emoji-picker-react';", "import EmojiPicker from 'emoji-picker-react';\nimport DataManagementTab from './components/DataManagementTab';");
}

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox'>('requests');",
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>('requests');"
);

const btnTarget = `<button onClick={() => setActiveTab('recycle')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিসাইকেল বিন ({deletedPosts.length})
          </button>`;
const btnReplace = `<button onClick={() => setActiveTab('recycle')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            রিসাইকেল বিন ({deletedPosts.length})
          </button>
          <button onClick={() => setActiveTab('data')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'data' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            ডেটা ম্যানেজমেন্ট
          </button>`;

code = code.replace(btnTarget, btnReplace);

const renderTarget = `{activeTab === 'recycle' && (`;
const renderReplace = `{activeTab === 'data' && (
          <DataManagementTab />
        )}
        
        {activeTab === 'recycle' && (`;

code = code.replace(renderTarget, renderReplace);

fs.writeFileSync('src/Admin.tsx', code);
