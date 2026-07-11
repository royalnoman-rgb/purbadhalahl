const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'reorder'>('requests');",
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox'>('requests');"
);

code = code.replace(/<button onClick=\{\(\) => setActiveTab\('reorder'\)[\s\S]*?<\/button>/, '');
code = code.replace(/\{activeTab === 'reorder' && \([\s\S]*?<ReorderTab \/>[\s\S]*?\}\)/, '');
code = code.replace("import ReorderTab from './ReorderTab';\n", "");

fs.writeFileSync('src/Admin.tsx', code);
