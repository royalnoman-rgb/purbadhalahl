const fs = require('fs');
let content = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');

content = content.replace(
  `    return Array.from(new Set([...fromContacts, ...fromDocs, ...fromPredefined])).map(title => {`,
  `    return Array.from(new Set([...fromContacts, ...fromDocs, ...fromPredefined])).sort((a, b) => a.localeCompare(b, 'bn')).map(title => {`
);

fs.writeFileSync('src/components/DataManagementTab.tsx', content);
console.log("Patched DataManagementTab.tsx sorting");
