const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "  const [contributorName, setContributorName] = useState('');\n  const [contributorPhone, setContributorPhone] = useState('');\n  const [contributorEmail, setContributorEmail] = useState('');\n  const [contributorFacebook, setContributorFacebook] = useState('');\n  const [contributorAvatar, setContributorAvatar] = useState('');\n  const [contributorDob, setContributorDob] = useState('');",
  "  const [contributorName, setContributorName] = useState(safeStorage.getItem('contributorName') || '');\n  const [contributorPhone, setContributorPhone] = useState(safeStorage.getItem('contributorPhone') || '');\n  const [contributorEmail, setContributorEmail] = useState(safeStorage.getItem('contributorEmail') || '');\n  const [contributorFacebook, setContributorFacebook] = useState(safeStorage.getItem('contributorFacebook') || '');\n  const [contributorAvatar, setContributorAvatar] = useState(safeStorage.getItem('contributorAvatar') || '');\n  const [contributorDob, setContributorDob] = useState(safeStorage.getItem('contributorDob') || '');"
);

code = code.replace(
  `  useEffect(() => {
    const savedName = safeStorage.getItem('contributorName');
    const savedPhone = safeStorage.getItem('contributorPhone');
    const savedEmail = safeStorage.getItem('contributorEmail');
    const savedFb = safeStorage.getItem('contributorFacebook');
    const savedAvatar = safeStorage.getItem('contributorAvatar');
    const savedDob = safeStorage.getItem('contributorDob');
    if (savedName) setContributorName(savedName);
    if (savedPhone) setContributorPhone(savedPhone);
    if (savedEmail) setContributorEmail(savedEmail);
    if (savedFb) setContributorFacebook(savedFb);
    if (savedAvatar) setContributorAvatar(savedAvatar);
    if (savedDob) setContributorDob(savedDob);
  }, []);`,
  ``
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed session init');
