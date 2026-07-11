const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { VisitorStats }')) {
  code = code.replace(
    "import { Star, ShieldAlert, LogOut, Settings, Phone, Search, Users, AlertTriangle } from 'lucide-react';",
    "import { Star, ShieldAlert, LogOut, Settings, Phone, Search, Users, AlertTriangle } from 'lucide-react';\nimport { VisitorStats } from './components/VisitorStats';"
  );
  
  code = code.replace(
    "<footer className=\"text-center py-6 text-gray-400 text-sm\">",
    "<footer className=\"text-center py-6 text-gray-400 text-sm\">\n        <VisitorStats />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
