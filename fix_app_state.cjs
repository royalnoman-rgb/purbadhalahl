const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateTarget = `const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);`;
const stateReplacement = `const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const prevNotifCount = useRef(0);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);`;

code = code.replace(stateTarget, stateReplacement);

const unreadNotifCount = `notifications.filter(n => !n.read).length`;

fs.writeFileSync('src/App.tsx', code);
