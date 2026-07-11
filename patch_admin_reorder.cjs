const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox'>('requests');",
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'reorder'>('requests');"
);

const reorderTabBtn = `
          <button onClick={() => setActiveTab('reorder')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'reorder' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
            সাজানো (Reorder)
          </button>
`;

code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\('recycle'\)[\s\S]*?<\/button>/,
  "$&" + reorderTabBtn
);

fs.writeFileSync('src/Admin.tsx', code);
