const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const allCategories = React.useMemo(() => {
    const mergedCategories = staticCategories.map(sc => {`;

const repl = `  const allCategories = React.useMemo(() => {
    const mergedCategories = staticCategories.map(sc => {`;

const insertAfter = `].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [dynamicCategories]);`;

const useEffectCode = `

  useEffect(() => {
    if (location.pathname === '/community') {
      if(!_showCommunity) _setShowCommunity(true);
      if(_selectedCategory) _setSelectedCategory(null);
      if(_selectedSubCategory) _setSelectedSubCategory(null);
      if(_showMap) _setShowMap(false);
    } else if (location.pathname === '/map') {
      if(!_showMap) _setShowMap(true);
      if(_selectedCategory) _setSelectedCategory(null);
      if(_selectedSubCategory) _setSelectedSubCategory(null);
      if(_showCommunity) _setShowCommunity(false);
    } else if (categoryId) {
      const cat = allCategories.find(c => c.id === categoryId);
      if (cat) {
        if(_selectedCategory?.id !== cat.id) _setSelectedCategory(cat);
        const sub = subCategory ? decodeURIComponent(subCategory) : null;
        if(_selectedSubCategory !== sub) _setSelectedSubCategory(sub);
        if(_showCommunity) _setShowCommunity(false);
        if(_showMap) _setShowMap(false);
      }
    } else {
      if(_selectedCategory) _setSelectedCategory(null);
      if(_selectedSubCategory) _setSelectedSubCategory(null);
      if(_showCommunity) _setShowCommunity(false);
      if(_showMap) _setShowMap(false);
    }
  }, [categoryId, subCategory, location.pathname, allCategories]);
`;

code = code.replace(insertAfter, insertAfter + useEffectCode);
fs.writeFileSync('src/App.tsx', code);
console.log("useEffect added");
