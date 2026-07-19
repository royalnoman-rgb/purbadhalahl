const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [searchQuery, setSearchQuery] = useState('');`;
const replacementState = `  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);`;

const targetFilter = `  const filteredContacts = allContacts.filter((c) => {
    const matchesCategory = selectedCategory ? c.categoryId === selectedCategory.id : true;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery) || c.phone.includes(toEnglishDigits(searchQuery));
    return matchesCategory && matchesSearch;
  }).sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));`;

const replacementFilter = `  const filteredContacts = React.useMemo(() => {
    return allContacts.filter((c) => {
      const matchesCategory = selectedCategory ? c.categoryId === selectedCategory.id : true;
      const lowerSearch = debouncedSearchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(lowerSearch) || c.phone.includes(debouncedSearchQuery) || c.phone.includes(toEnglishDigits(debouncedSearchQuery));
      return matchesCategory && matchesSearch;
    }).sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [allContacts, selectedCategory, debouncedSearchQuery]);`;

if (code.includes(targetState) && code.includes(targetFilter)) {
  code = code.replace(targetState, replacementState);
  code = code.replace(targetFilter, replacementFilter);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Applied debouncing and memoization');
} else {
  console.log('Target not found');
}
