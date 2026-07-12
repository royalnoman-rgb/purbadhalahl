const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes("import { toBengaliDigits, toEnglishDigits }")) {
  code = code.replace("import { Trash2", "import { toBengaliDigits, toEnglishDigits } from './utils';\nimport { Trash2");
}

code = code.replaceAll(`{cont.phone}`, `{toBengaliDigits(cont.phone)}`);
code = code.replaceAll(`{contact.phone}`, `{toBengaliDigits(contact.phone)}`);

// value={editRequestData.phone || ''} -> onChange={... toEnglishDigits(e.target.value)}
code = code.replace(
  `value={editRequestData.phone || ''} onChange={e => setEditRequestData({...editRequestData, phone: e.target.value})}`,
  `value={toBengaliDigits(editRequestData.phone) || ''} onChange={e => setEditRequestData({...editRequestData, phone: toEnglishDigits(e.target.value)})}`
);

fs.writeFileSync('src/Admin.tsx', code);
