const fs = require('fs');

let adminContent = fs.readFileSync('src/Admin.tsx', 'utf8');

// Add isSuperAdmin state
adminContent = adminContent.replace(
  `const [isAuthenticated, setIsAuthenticated] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin');`,
  `const [isAuthenticated, setIsAuthenticated] = useState(safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'moderator' || safeStorage.getItem('contributorRole') === 'admin');\n  const isSuperAdmin = safeStorage.getItem('adminAuth') === 'true' || safeStorage.getItem('contributorRole') === 'admin';`
);

// Add handleToggleModerator function
adminContent = adminContent.replace(
  `const handleLogin = (e: React.FormEvent) => {`,
  `const handleToggleModerator = async (id: string, currentRole: string) => {
    if (!isSuperAdmin) {
      alert('শুধুমাত্র প্রধান অ্যাডমিন এই কাজটি করতে পারবেন।');
      return;
    }
    const newRole = currentRole === 'moderator' ? 'user' : 'moderator';
    try {
      await updateDoc(doc(db, 'contributors', id), { role: newRole });
      alert(newRole === 'moderator' ? 'মডারেটর হিসেবে নিযুক্ত করা হয়েছে।' : 'মডারেটর পদ থেকে সরানো হয়েছে।');
    } catch (e) {
      console.error(e);
      alert('কোথাও সমস্যা হয়েছে!');
    }
  };

  const handleLogin = (e: React.FormEvent) => {`
);

// Update UI to show role and toggle button
adminContent = adminContent.replace(
  `<span>Approved: <span className="text-blue-600">{cont.approvedCount || 0}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">`,
  `<span>Approved: <span className="text-blue-600">{cont.approvedCount || 0}</span></span>
                      </div>
                      <div className="mt-2">
                        {cont.role === 'moderator' && <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold border border-purple-200">মডারেটর</span>}
                        {cont.role === 'admin' && <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold border border-red-200">অ্যাডমিন</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSuperAdmin && cont.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleModerator(cont.id, cont.role)}
                          className={\`p-2 rounded-lg relative text-xs font-medium transition-colors \${cont.role === 'moderator' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}\`}
                          title={cont.role === 'moderator' ? 'মডারেটর থেকে সরান' : 'মডারেটর বানান'}
                        >
                          <Shield className="w-5 h-5" />
                        </button>
                      )}`
);

fs.writeFileSync('src/Admin.tsx', adminContent);

console.log("Patched admin roles");
