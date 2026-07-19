const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes('Share2')) {
  code = code.replace(
    "} from 'lucide-react';",
    ", Share2 } from 'lucide-react';"
  );
  fs.writeFileSync('src/App.tsx', code);
}
