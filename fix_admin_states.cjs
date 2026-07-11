const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetState = `const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');`;
const replacementState = `const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const prevNotifCount = useRef(0);`;

code = code.replace(targetState, replacementState);
fs.writeFileSync('src/Admin.tsx', code);
