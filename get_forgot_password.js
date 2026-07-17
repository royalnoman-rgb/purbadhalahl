const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');
let start = lines.findIndex(l => l.includes('const handleForgotPassword = async'));
let end = lines.findIndex((l, i) => i > start && l.includes('const handleRestorePassword ='));
console.log(lines.slice(start, end).join('\n'));
