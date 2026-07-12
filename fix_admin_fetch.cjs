const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetStr = `  const fetchData = async () => {
    try {
      const contactsQuery = query(collection(db, 'contacts'), where('status', '==', 'pending'));`;

const replaceStr = `  const fetchData = async () => {
    try {
      const catSnap = await getDocs(query(collection(db, 'categories'), where('status', '==', 'approved')));
      const dCats = catSnap.docs.map(d => ({id: d.id, ...d.data()}));
      const dCatIds = new Set(dCats.map(c => c.id));
      const aCats = [...staticCategories.filter(c => !dCatIds.has(c.id)), ...dCats];
      setAllCats(aCats);

      const subSnap = await getDocs(query(collection(db, 'subcategories'), where('status', '==', 'approved')));
      const dSubCats = subSnap.docs.map(d => ({id: d.id, ...d.data()}));
      const combinedSubCats = [...predefinedSubCategories];
      dSubCats.forEach(ds => {
        let pc = combinedSubCats.find(c => c.categoryId === ds.categoryId);
        if (pc) {
           if (!pc.subCategories.includes(ds.title)) pc.subCategories.push(ds.title);
        } else {
           combinedSubCats.push({ categoryId: ds.categoryId, subCategories: [ds.title] });
        }
      });
      setAllSubCats(combinedSubCats);

      const contactsQuery = query(collection(db, 'contacts'), where('status', '==', 'pending'));`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/Admin.tsx', code);
  console.log("Successfully fixed admin fetch");
} else {
  console.log("Failed to find fetchData");
}
