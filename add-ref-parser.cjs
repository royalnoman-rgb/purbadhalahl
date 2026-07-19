const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);`;
const replacement = `  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      safeStorage.setItem('referredBy', ref);
      // Optional: remove ref from url to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);`;

if (code.includes(target) && !code.includes('referredBy')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Added ref parser');
}
