const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

content = content.replace(
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data' | 'duplicates'>('requests');",
  "const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle' | 'inbox' | 'data'>('requests');"
);

content = content.replace(/<button onClick=\{\(\) => setActiveTab\('duplicates'\)\}.*?<\/button>/g, '');
content = content.replace(/\{activeTab === 'duplicates' && \(\s*<DuplicatesTab \/>\s*\)\}/g, '');
content = content.replace("import DuplicatesTab from './components/DuplicatesTab';", '');

fs.writeFileSync('src/Admin.tsx', content);

try { fs.unlinkSync('src/components/DuplicatesTab.tsx'); } catch(e) {}
