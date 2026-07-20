const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCount = `totalContacts={allContacts.filter(c => c.status === 'approved').length}`;
const replacementCount = `totalContacts={allContacts.filter(c => c.status === 'approved' || !c.status).length}`;

if (code.includes(targetCount)) {
  code = code.replace(targetCount, replacementCount);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully fixed totalContacts count for SiteStats');
} else {
  console.log('Failed to find totalContacts count target');
}
