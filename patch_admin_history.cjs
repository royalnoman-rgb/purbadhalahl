const fs = require('fs');

let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetLogout = `<button onClick={() => { setIsAuthenticated(false); safeStorage.removeItem('adminAuth'); }} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`;
const replLogout = `<button onClick={async () => { 
    setIsAuthenticated(false); 
    safeStorage.removeItem('adminAuth'); 
    const docId = safeStorage.getItem('modSessionDocId');
    if (docId) {
       try {
           await updateDoc(doc(db, 'admin_history', docId), {
               isLoggedOut: true,
               lastActive: new Date().toISOString()
           });
       } catch(e) {}
       safeStorage.removeItem('modSessionDocId');
    }
}} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`;

const targetRender = `<p className="text-sm font-medium text-gray-800">{item.action}</p>`;
const replRender = `{item.type === 'session' ? (
                        <p className="text-sm font-medium text-gray-800 flex flex-col sm:flex-row sm:items-center gap-1">
                             অ্যাডমিন প্যানেলে লগইন সেশন 
                             <span className="text-xs font-normal text-gray-500">
                                {(() => {
                                  const start = new Date(item.createdAt).getTime();
                                  const end = new Date(item.lastActive || item.createdAt).getTime();
                                  const durationMins = Math.round((end - start) / 60000);
                                  const isInactive = (Date.now() - end) > 2 * 60 * 1000;
                                  if (item.isLoggedOut || isInactive) {
                                     return \`(লগআউট করেছেন/বের হয়েছেন - সময়কাল: \${durationMins} মিনিট)\`;
                                  } else {
                                     return \`(বর্তমানে অ্যাক্টিভ আছেন - সময়কাল: \${durationMins} মিনিট)\`;
                                  }
                                })()}
                             </span>
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-gray-800">{item.action}</p>
                      )}`;

const targetEffect = `  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Request notification permission on load`;

const replEffect = `  useEffect(() => {
    let interval: any;
    const adminName = safeStorage.getItem('contributorName') || (isSuperAdmin ? 'অ্যাডমিন' : 'মডারেটর');
    const adminPhone = safeStorage.getItem('contributorPhone') || 'admin';
    const isGlobalAdmin = safeStorage.getItem('adminAuth') === 'true' && !safeStorage.getItem('contributorRole');
    
    if (isAuthenticated && !isGlobalAdmin) {
      let docId = safeStorage.getItem('modSessionDocId');
      
      const updateSession = async () => {
         if (!docId) return;
         try {
           await updateDoc(doc(db, 'admin_history', docId), {
             lastActive: new Date().toISOString()
           });
         } catch(e) {}
      };

      const startSession = async () => {
         try {
           const docRef = await addDoc(collection(db, 'admin_history'), {
             type: 'session',
             action: 'লগইন সেশন',
             moderatorName: adminName,
             moderatorPhone: adminPhone,
             createdAt: new Date().toISOString(),
             lastActive: new Date().toISOString()
           });
           docId = docRef.id;
           safeStorage.setItem('modSessionDocId', docId);
         } catch(e) {}
      };

      if (!docId) {
         startSession();
      } else {
         updateSession();
      }
      
      interval = setInterval(updateSession, 60000);
    }
    
    return () => {
       if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, isSuperAdmin]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Request notification permission on load`;

if (adminCode.includes(targetLogout)) {
  adminCode = adminCode.replace(targetLogout, replLogout);
} else {
  console.log('Failed to patch logout button');
}

if (adminCode.includes(targetRender)) {
  adminCode = adminCode.replace(targetRender, replRender);
} else {
  console.log('Failed to patch render history');
}

if (adminCode.includes(targetEffect)) {
  adminCode = adminCode.replace(targetEffect, replEffect);
} else {
  console.log('Failed to patch effect');
}

fs.writeFileSync('src/Admin.tsx', adminCode);
console.log('Successfully patched admin session tracking');
