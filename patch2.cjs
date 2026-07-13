const fs = require('fs');
const file = 'src/components/DataManagementTab.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove where clause to fetch all
content = content.replace(
  "query(collection(db, 'contacts'), where('status', '==', 'approved'));",
  "query(collection(db, 'contacts'));"
);

// add table header
content = content.replace(
  '<th className="p-3">সাব-ক্যাটাগরি</th>\n              </tr>',
  '<th className="p-3">সাব-ক্যাটাগরি</th>\n                <th className="p-3">স্ট্যাটাস</th>\n              </tr>'
);

// add table column
content = content.replace(
  '<td className="p-3">{c.subCategory || \'-\'}</td>\n                </tr>',
  '<td className="p-3">{c.subCategory || \'-\'}</td>\n                  <td className="p-3">{c.status === \'pending\' ? <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">পেন্ডিং</span> : <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">অ্যাপ্রুভড</span>}</td>\n                </tr>'
);

fs.writeFileSync(file, content);
