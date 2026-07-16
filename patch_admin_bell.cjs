const fs = require('fs');

let adminContent = fs.readFileSync('src/Admin.tsx', 'utf8');

adminContent = adminContent.replace(
  `<div className="relative" ref={adminNotifRef}>`,
  `{isSuperAdmin && (<div className="relative" ref={adminNotifRef}>`
);

adminContent = adminContent.replace(
  `</div>
          <button onClick={() => { setIsAuthenticated(false); safeStorage.removeItem('adminAuth'); }} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`,
  `</div>)}
          <button onClick={() => { setIsAuthenticated(false); safeStorage.removeItem('adminAuth'); }} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`
);

fs.writeFileSync('src/Admin.tsx', adminContent);

console.log("Patched admin bell");
