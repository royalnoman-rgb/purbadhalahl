const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// I will just use replace to wrap each block.
// Block 1: Feedbacks
// It starts at line 1453: {activeUserTab === 'feedbacks' && (
// It ends around 1595. We need to add )} before <div className="mb-4"> where "অ্যাডমিন থেকে ম্যাসেজ" is.

const idxMessages = code.indexOf('<h3 className="font-semibold text-gray-900">অ্যাডমিন থেকে ম্যাসেজ</h3>');
// Find the <div className="mb-4"> before that
const strBeforeMessages = code.substring(0, idxMessages);
const lastDivMb4 = strBeforeMessages.lastIndexOf('<div className="mb-4">');

code = code.substring(0, lastDivMb4) + ")} \\n {activeUserTab === 'messages' && ( \\n " + code.substring(lastDivMb4);

fs.writeFileSync(file, code);
