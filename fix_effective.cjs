const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

code = code.replace("const effectivePhone = isAdmin ? 'admin' : effectivePhone;", "const effectivePhone = isAdmin ? 'admin' : contributorPhone;");
code = code.replace("const effectiveName = isAdmin ? 'অ্যাডমিন' : effectiveName;", "const effectiveName = isAdmin ? 'অ্যাডমিন' : contributorName;");
code = code.replace("const effectiveAvatar = isAdmin ? '' : effectiveAvatar;", "const effectiveAvatar = isAdmin ? '' : contributorAvatar;");

fs.writeFileSync('src/Community.tsx', code);
