const fs = require('fs');
const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const [isAuthenticated, setIsAuthenticated] = useState(false);`,
  `const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');`
);

code = code.replace(
  `    if (password === 'admin123') { // Simple secret for now
      setIsAuthenticated(true);
    } else {`,
  `    if (password === 'admin123') { // Simple secret for now
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {`
);

code = code.replace(
  `        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`,
  `        <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('adminAuth'); }} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>`
);

fs.writeFileSync(file, code);
