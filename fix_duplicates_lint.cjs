const fs = require('fs');
let code = fs.readFileSync('src/components/DuplicatesTab.tsx', 'utf8');

const targetStr = `import { Trash2, AlertCircle } from 'lucide-react';`;
const replaceStr = `import { Trash2, AlertCircle, CheckCircle } from 'lucide-react';`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/DuplicatesTab.tsx', code);
  console.log('Successfully fixed CheckCircle import');
} else {
  console.log('Failed to find target string');
}
