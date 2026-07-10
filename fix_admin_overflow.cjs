const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace <div className="grid gap-4"> with a max-height container for all sections
code = code.replace(/<div className="grid gap-4">/g, '<div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">');

fs.writeFileSync(file, code);
