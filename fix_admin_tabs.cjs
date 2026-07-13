const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

content = content.replace(/<button onClick=\{\(\) => setActiveTab\('duplicates'\)\}.*?<\/button>/g, '');
content = content.replace(/\s*ডুপলিকেট\s*<\/button>/g, ''); // just in case

// Use a simpler approach: remove lines with 'duplicates' if they are buttons
const lines = content.split('\n');
const newLines = lines.filter(line => !line.includes("setActiveTab('duplicates')"));
content = newLines.join('\n');

fs.writeFileSync('src/Admin.tsx', content);
