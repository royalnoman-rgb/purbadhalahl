const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('const handleBack = () => {', 'function handleBack() {');

fs.writeFileSync('src/App.tsx', content);
console.log("Fixed handleBack hoisting");
