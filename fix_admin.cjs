const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetStr = `                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.details || ''} onChange={e => setEditRequestData({...editRequestData, details: e.target.value})} placeholder="Details" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.subDetails || ''} onChange={e => setEditRequestData({...editRequestData, subDetails: e.target.value})} placeholder="Sub Details" />`;

const replaceStr = `                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.details || ''} onChange={e => setEditRequestData({...editRequestData, details: e.target.value})} placeholder="Details" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.subDetails || ''} onChange={e => setEditRequestData({...editRequestData, subDetails: e.target.value})} placeholder="Sub Details" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.categoryId || ''} onChange={e => setEditRequestData({...editRequestData, categoryId: e.target.value})} placeholder="Category ID" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.subCategory || ''} onChange={e => setEditRequestData({...editRequestData, subCategory: e.target.value})} placeholder="Sub Category" />`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/Admin.tsx', code);
