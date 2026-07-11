const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Bell')) {
  code = code.replace("import { CheckCircle, XCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Trophy, LogOut, CheckCircle2 } from 'lucide-react';", "import { CheckCircle, XCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Trophy, LogOut, CheckCircle2, Bell } from 'lucide-react';");
}

fs.writeFileSync('src/App.tsx', code);
