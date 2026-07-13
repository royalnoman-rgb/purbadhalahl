const fs = require('fs');

const dataFile = fs.readFileSync('src/data.ts', 'utf8');

// Match categories array
const categoriesMatch = dataFile.match(/export const categories: Category\[\] = (\[[\s\S]*?\]);/);
let categories = [];
if (categoriesMatch) {
  categories = eval(categoriesMatch[1]);
}

// Match predefined subcategories
const predefinedMatch = dataFile.match(/export const predefinedSubCategories: {.*?}\[\] = (\[[\s\S]*?\]);/);
let predefined = [];
if (predefinedMatch) {
  predefined = eval(predefinedMatch[1]);
}

let catNames = new Set();
let dupCats = [];
categories.forEach(c => {
  if (catNames.has(c.title)) dupCats.push(c.title);
  catNames.add(c.title);
});

let dupSubCats = [];
predefined.forEach(cat => {
  let subSet = new Set();
  cat.subCategories.forEach(sc => {
    if (subSet.has(sc)) dupSubCats.push({cat: cat.categoryId, sub: sc});
    subSet.add(sc);
  });
});

console.log("Duplicate Categories:", dupCats);
console.log("Duplicate SubCategories (within same cat):", dupSubCats);

