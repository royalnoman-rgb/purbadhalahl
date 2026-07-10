const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

code = code.replace("await logAdminAction(`Contact deleted: ${data.name || 'Unknown'`);", "await logAdminAction(`Contact deleted: ${data.name || 'Unknown'}`);");

fs.writeFileSync('src/Admin.tsx', code);
