const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

// The original condition
const oldCond = 'if (data.sessionId && localSessionId && data.sessionId !== localSessionId) {';
const newCond = 'if (data.sessionId && data.sessionId !== localSessionId) {';

if (content.includes(oldCond)) {
  content = content.replace(oldCond, newCond);
  fs.writeFileSync('src/Admin.tsx', content, 'utf8');
  console.log('Force logout logic updated in Admin.tsx');
} else {
  console.log('Could not find the old condition in Admin.tsx');
}
