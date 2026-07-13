const fs = require('fs');
const dataFile = fs.readFileSync('src/data.ts', 'utf8');

const categoriesMatch = dataFile.match(/export const categories: Category\[\] = (\[[\s\S]*?\]);/);
let categories = [];
if (categoriesMatch) {
  categories = eval(categoriesMatch[1]);
}

const predefinedMatch = dataFile.match(/export const predefinedSubCategories: {.*?}\[\] = (\[[\s\S]*?\]);/);
let predefined = [];
if (predefinedMatch) {
  predefined = eval(predefinedMatch[1]);
}

console.log("Categories:");
categories.forEach(c => console.log(`- ${c.title}`));

console.log("\nSubCategories:");
predefined.forEach(p => {
  console.log(`\nCat [${p.categoryId}]:`);
  p.subCategories.forEach(sc => console.log(`  - ${sc}`));
});

