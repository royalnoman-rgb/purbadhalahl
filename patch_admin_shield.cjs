const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');
content = content.replace(
  `import { CheckCircle, XCircle, MessageCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Edit3, ThumbsUp, CheckCircle2, X, Key, Bell, Smile } from 'lucide-react';`,
  `import { CheckCircle, XCircle, MessageCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Edit3, ThumbsUp, CheckCircle2, X, Key, Bell, Smile, Shield } from 'lucide-react';`
);
fs.writeFileSync('src/Admin.tsx', content);
