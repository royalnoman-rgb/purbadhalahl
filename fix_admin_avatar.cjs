const fs = require('fs');

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('<link rel="icon"')) {
  html = html.replace('</title>', '</title>\n    <link rel="icon" type="image/png" href="/logo.png" />');
  fs.writeFileSync('index.html', html);
}

// Update Community.tsx
let community = fs.readFileSync('src/Community.tsx', 'utf8');
community = community.replace("const effectiveAvatar = isAdmin ? '' : contributorAvatar;", "const effectiveAvatar = isAdmin ? '/logo.png' : contributorAvatar;");
fs.writeFileSync('src/Community.tsx', community);

// Update App.tsx replies? Actually App.tsx replies don't show avatar, just text 'অ্যাডমিন'.
// Let's check App.tsx for where it might render admin. 
