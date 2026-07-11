const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetInboxTabBtn = `<button onClick={() => setActiveTab('inbox')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'inbox' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>ইনবক্স</button>`;

const hasUnread = `contributors.some(c => c.hasUnreadAdminMessage)`;

const newInboxTabBtn = `<button onClick={() => setActiveTab('inbox')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors relative \${activeTab === 'inbox' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>
  ইনবক্স
  {contributors.some(c => c.hasUnreadAdminMessage) && (
    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
  )}
</button>`;

code = code.replace(targetInboxTabBtn, newInboxTabBtn);
fs.writeFileSync('src/Admin.tsx', code);
