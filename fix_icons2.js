import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("} , ArrowRight, Quote } from 'lucide-react'")) {
    lines[i] = lines[i].replace("} , ArrowRight, Quote } from 'lucide-react'", ", ArrowRight, Quote } from 'lucide-react'");
    break;
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
