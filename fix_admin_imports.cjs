const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetImport = `import { CheckCircle, XCircle, MessageCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Edit3, ThumbsUp, CheckCircle2, X, Key } from 'lucide-react';`;
const replacementImport = `import { CheckCircle, XCircle, MessageCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Edit3, ThumbsUp, CheckCircle2, X, Key, Bell } from 'lucide-react';`;

code = code.replace(targetImport, replacementImport);
fs.writeFileSync('src/Admin.tsx', code);
