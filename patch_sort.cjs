const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `              const sortedSubCats = rawSubCats.sort((a, b) => {
                const indexA = orderMap.has(a) ? orderMap.get(a)! : 999;
                const indexB = orderMap.has(b) ? orderMap.get(b)! : 999;
                return indexA - indexB;
              });`,
  `              const sortedSubCats = rawSubCats.sort((a, b) => {
                const indexA = orderMap.has(a) ? orderMap.get(a)! : 999;
                const indexB = orderMap.has(b) ? orderMap.get(b)! : 999;
                if (indexA !== indexB) {
                  return indexA - indexB;
                }
                return a.localeCompare(b, 'bn');
              });`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched sorting in App.tsx");
