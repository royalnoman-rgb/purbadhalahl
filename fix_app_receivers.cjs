const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!contributorPhone && !isAdmin) return;
    const receiverId = isAdmin ? 'admin' : contributorPhone;
    const qNotif = query(collection(db, 'notifications'), where('receiverPhone', '==', receiverId));`;

const replace = `  useEffect(() => {
    if (!contributorPhone && !isAdmin) return;
    const receiverIds = [];
    if (contributorPhone) receiverIds.push(contributorPhone);
    if (isAdmin) receiverIds.push('admin');
    
    const qNotif = query(collection(db, 'notifications'), where('receiverPhone', 'in', receiverIds));`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
