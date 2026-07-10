const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/<\/main>/, "        </div>\n      </main>");

fs.writeFileSync(file, code);
