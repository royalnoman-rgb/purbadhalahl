const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
    const [dynamicContacts, setDynamicContacts] = useState<any[]>([]);`;
    
const targetSubCats = `  const [dynamicSubCategories, setDynamicSubCategories] = useState<any[]>([]);`;

const replacementState = `  const getCachedData = (key: string) => {
    try {
      const cached = safeStorage.getItem(key);
      const cacheTime = safeStorage.getItem(key + '_time');
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) {
        return JSON.parse(cached);
      }
    } catch(e) {}
    return [];
  };

  const [dynamicCategories, setDynamicCategories] = useState<Category[]>(() => getCachedData('cats_cache'));
  const [dynamicContacts, setDynamicContacts] = useState<any[]>(() => getCachedData('contacts_cache'));`;

const replacementSubCats = `  const [dynamicSubCategories, setDynamicSubCategories] = useState<any[]>(() => getCachedData('subCats_cache'));`;

if (code.includes(targetState) && code.includes(targetSubCats)) {
  code = code.replace(targetState, replacementState);
  code = code.replace(targetSubCats, replacementSubCats);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully applied lazy initial state');
} else {
  console.log('Failed to find targets for lazy initialization');
}
