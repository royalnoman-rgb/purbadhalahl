const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `      {Array.from(new Set([
        ...allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory),
        ...(predefinedSubCategories.find(pc => pc.categoryId === newCategory)?.subCategories || []),
        ...dynamicSubCategories.filter(sc => sc.categoryId === newCategory).map(sc => sc.title)
      ])).map(sub => (
         <option key={sub} value={sub}>{sub}</option>
      ))}`,
  `      {Array.from(new Set([
        ...allContacts.filter(c => c.categoryId === newCategory && c.subCategory).map(c => c.subCategory),
        ...(predefinedSubCategories.find(pc => pc.categoryId === newCategory)?.subCategories || []),
        ...dynamicSubCategories.filter(sc => sc.categoryId === newCategory).map(sc => sc.title)
      ])).sort((a, b) => a.localeCompare(b, 'bn')).map(sub => (
         <option key={sub} value={sub}>{sub}</option>
      ))}`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched select sorting in App.tsx");
