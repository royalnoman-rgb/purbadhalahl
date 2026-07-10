const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const idxProfile = code.indexOf('<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">');
code = code.substring(0, idxProfile) + ")} \\n " + code.substring(idxProfile);

code = code.replace(/\\n/g, '\n'); // Because I accidentally put \\n instead of \n in the previous commands

fs.writeFileSync(file, code);
