const fs = require('fs');
let code = fs.readFileSync('src/components/DataManagementTab.tsx', 'utf8');

code = code.replace(
  "import { categories as staticCategories, contacts as staticContacts } from '../data';",
  "import { categories as staticCategories, contacts as staticContacts, predefinedSubCategories } from '../data';"
);

const searchStr = `  const getDerivedSubcats = (catId: string) => {
    const fromContacts = contacts.filter(c => c.categoryId === catId && c.subCategory).map(c => c.subCategory);
    const fromDocs = subcategories.filter(sc => sc.categoryId === catId).map(sc => sc.title);
    
    return Array.from(new Set([...fromContacts, ...fromDocs])).map(title => {`;

const replaceStr = `  const getDerivedSubcats = (catId: string) => {
    const fromContacts = contacts.filter(c => c.categoryId === catId && c.subCategory).map(c => c.subCategory);
    const fromDocs = subcategories.filter(sc => sc.categoryId === catId).map(sc => sc.title);
    const fromPredefined = predefinedSubCategories.find(pc => pc.categoryId === catId)?.subCategories || [];
    
    return Array.from(new Set([...fromContacts, ...fromDocs, ...fromPredefined])).map(title => {`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/components/DataManagementTab.tsx', code);
