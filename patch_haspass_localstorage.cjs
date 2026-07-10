const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `const [hasPassword, setHasPassword] = useState(false);`;
const rep1 = `const [hasPassword, setHasPassword] = useState(localStorage.getItem('hasPassword') === 'true');`;
code = code.replace(target1, rep1);

const target2 = `setHasPassword(!!data.password);`;
const rep2 = `setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');`;
code = code.split(target2).join(rep2);

const target3 = `setHasPassword(true);`;
const rep3 = `setHasPassword(true);
        localStorage.setItem('hasPassword', 'true');`;
code = code.split(target3).join(rep3);

const target4 = `        setLoginPhone('');
        setLoginPassword('');
        
        if (!data.password) {`;
const rep4 = `        setLoginPhone('');
        setLoginPassword('');
        
        if (data.password) {
          localStorage.setItem('hasPassword', 'true');
        } else {
          localStorage.removeItem('hasPassword');
        }
        
        if (!data.password) {`;
code = code.replace(target4, rep4);


fs.writeFileSync(file, code);
console.log("Patched hasPassword localstorage!");
