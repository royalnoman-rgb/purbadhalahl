import fs from 'fs';

let content = fs.readFileSync('src/Admin.tsx', 'utf8');

content = content.replace(
`  const logAdminAction = async (actionDesc: string) => {
    try {
      await addDoc(collection(db, 'admin_history'), {
        action: actionDesc,
        createdAt: new Date().toISOString()
      });`,
`  const logAdminAction = async (actionDesc: string) => {
    try {
      const adminName = safeStorage.getItem('contributorName') || (isSuperAdmin ? 'অ্যাডমিন' : 'মডারেটর');
      const adminPhone = safeStorage.getItem('contributorPhone') || 'admin';
      await addDoc(collection(db, 'admin_history'), {
        action: actionDesc,
        moderatorName: adminName,
        moderatorPhone: adminPhone,
        createdAt: new Date().toISOString()
      });`
);

content = content.replace(
`                    <p className="text-sm font-medium text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{new Date(item.createdAt).toLocaleString('bn-BD')}</p>`,
`                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.action}</p>
                      {item.moderatorName && (
                        <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                           <UserCircle className="w-3 h-3"/> দ্বারা সম্পন্ন: {item.moderatorName} 
                           {item.moderatorPhone !== 'admin' ? \` (\${item.moderatorPhone})\` : ''}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{new Date(item.createdAt).toLocaleString('bn-BD')}</p>`
);

fs.writeFileSync('src/Admin.tsx', content);
