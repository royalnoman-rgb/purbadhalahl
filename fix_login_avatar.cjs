const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `        setContributorName(data.name || '');
        setContributorPhone(data.phone || loginPhone);
        setContributorFacebook(data.facebookUrl || '');`;
const replace1 = `        setContributorName(data.name || '');
        setContributorPhone(data.phone || loginPhone);
        setContributorFacebook(data.facebookUrl || '');
        setContributorAvatar(data.avatar || '');`;

const target2 = `        localStorage.setItem('contributorName', data.name || '');
        localStorage.setItem('contributorPhone', data.phone || loginPhone);
        localStorage.setItem('contributorFacebook', data.facebookUrl || '');`;
const replace2 = `        localStorage.setItem('contributorName', data.name || '');
        localStorage.setItem('contributorPhone', data.phone || loginPhone);
        localStorage.setItem('contributorFacebook', data.facebookUrl || '');
        if (data.avatar) {
          localStorage.setItem('contributorAvatar', data.avatar);
        } else {
          localStorage.removeItem('contributorAvatar');
        }`;

code = code.replace(target1, replace1).replace(target2, replace2);

fs.writeFileSync('src/App.tsx', code);
