import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let sub = lines.slice(2983, 3744).join('\n');
let tags = [];

// A better way is to just use TypeScript compiler's own AST or a proper JSX parser.
// Let's use babel!
