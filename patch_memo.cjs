const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMergedCats = `  const mergedCategories = staticCategories.map(sc => {
    const dynamicCategory = dynamicCategories.find(dc => dc.id === sc.id);
    if (dynamicCategory) {
      return {
        ...sc,
        ...dynamicCategory,
        subCategoriesOrder: dynamicCategory.subCategoriesOrder?.length ? dynamicCategory.subCategoriesOrder : sc.subCategoriesOrder
      };
    }
    return sc;
  });
  const allCategories = [
    ...mergedCategories,
    ...dynamicCategories.filter(dc => !staticCategories.some(sc => sc.id === dc.id))
  ].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));`;

const replacementMergedCats = `  const allCategories = React.useMemo(() => {
    const mergedCategories = staticCategories.map(sc => {
      const dynamicCategory = dynamicCategories.find(dc => dc.id === sc.id);
      if (dynamicCategory) {
        return {
          ...sc,
          ...dynamicCategory,
          subCategoriesOrder: dynamicCategory.subCategoriesOrder?.length ? dynamicCategory.subCategoriesOrder : sc.subCategoriesOrder
        };
      }
      return sc;
    });
    return [
      ...mergedCategories,
      ...dynamicCategories.filter(dc => !staticCategories.some(sc => sc.id === dc.id))
    ].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [dynamicCategories]);`;

if (code.includes(targetMergedCats)) {
  code = code.replace(targetMergedCats, replacementMergedCats);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Memoized categories');
} else {
  console.log('Target not found for categories memoization');
}
