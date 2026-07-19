const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetSubCats = `      const combinedSubCats = [...predefinedSubCategories];
      dSubCats.forEach(ds => {
        let pc = combinedSubCats.find(c => c.categoryId === ds.categoryId);
        if (pc) {
           if (!pc.subCategories.includes(ds.title)) pc.subCategories.push(ds.title);
        } else {
           combinedSubCats.push({ categoryId: ds.categoryId, subCategories: [ds.title] });
        }
      });`;

const replacementSubCats = `      const combinedSubCats = predefinedSubCategories.map(c => ({...c, subCategories: [...c.subCategories]}));
      dSubCats.forEach(ds => {
        let pc = combinedSubCats.find(c => c.categoryId === ds.categoryId);
        if (pc) {
           if (!pc.subCategories.includes(ds.title)) pc.subCategories.push(ds.title);
        } else {
           combinedSubCats.push({ categoryId: ds.categoryId, subCategories: [ds.title] });
        }
      });`;

if (code.includes(targetSubCats)) {
  code = code.replace(targetSubCats, replacementSubCats);
  fs.writeFileSync('src/Admin.tsx', code);
  console.log("Fixed Admin.tsx combinedSubCats");
} else {
  console.log("targetSubCats not found in Admin.tsx");
}
