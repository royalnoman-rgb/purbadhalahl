import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
`      const existing = subCategories.find(s => s.categoryId === newSubCatParentId && s.title.trim().toLowerCase() === newSubCatTitle.trim().toLowerCase());`,
`      const existingPredefined = predefinedSubCategories.find(pc => pc.categoryId === newSubCatParentId)?.subCategories.some(sub => sub.toLowerCase() === newSubCatTitle.trim().toLowerCase());
      const existingDynamic = dynamicSubCategories.find(s => s.categoryId === newSubCatParentId && s.title.trim().toLowerCase() === newSubCatTitle.trim().toLowerCase());
      const existing = existingPredefined || existingDynamic;`
);

content = content.replace(
`        const existing = categories.find(c => c.title.trim().toLowerCase() === newCatTitle.trim().toLowerCase() || (c.englishTitle && newCatEnglish && c.englishTitle.trim().toLowerCase() === newCatEnglish.trim().toLowerCase()));`,
`        const existing = allCategories.find(c => c.title.trim().toLowerCase() === newCatTitle.trim().toLowerCase() || (c.englishTitle && newCatEnglish && c.englishTitle.trim().toLowerCase() === newCatEnglish.trim().toLowerCase()));`
);

fs.writeFileSync('src/App.tsx', content);
