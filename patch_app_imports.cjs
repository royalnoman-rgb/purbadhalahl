const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy, limit, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';`,
  `import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy, limit, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';`
);

code = code.replace(
  `export default function App() {`,
  `export default function App() {\n  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminAuth') === 'true');`
);

fs.writeFileSync(file, code);
