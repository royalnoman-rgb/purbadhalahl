const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const idxContacts = code.indexOf('<h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>');
const strBeforeContacts = code.substring(0, idxContacts);
const lastDivMb4Contacts = strBeforeContacts.lastIndexOf('<div className="mb-4">');

code = code.substring(0, lastDivMb4Contacts) + ")} \\n {activeUserTab === 'contacts' && ( \\n " + code.substring(lastDivMb4Contacts);

fs.writeFileSync(file, code);
