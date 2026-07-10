const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `<div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {selectedCategory || showMap || showCommunity ? (`;
            
const replace = `<div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          {selectedCategory || showMap || showCommunity ? (`;

code = code.replace(target, replace);
fs.writeFileSync(file, code);
