const fs = require('fs');

let adminCode = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetStats = `<div className="flex gap-4 mt-1 text-sm font-medium text-gray-700">
                        <span>Points: <span className="text-emerald-600">{cont.points || 0}</span></span>
                        <span>Approved: <span className="text-blue-600">{cont.approvedCount || 0}</span></span>
                      </div>`;
const replStats = `<div className="flex flex-wrap gap-4 mt-1 text-sm font-medium text-gray-700">
                        <span>Points: <span className="text-emerald-600">{cont.points || 0}</span></span>
                        <span>Approved: <span className="text-blue-600">{cont.approvedCount || 0}</span></span>
                        {cont.createdAt && <span className="text-gray-500 text-xs mt-0.5">Joined: {new Date(cont.createdAt).toLocaleDateString('bn-BD')}</span>}
                      </div>`;

if (adminCode.includes(targetStats)) {
  adminCode = adminCode.replace(targetStats, replStats);
  fs.writeFileSync('src/Admin.tsx', adminCode);
  console.log('Successfully added Joined date');
} else {
  console.log('Failed to add Joined date');
}
