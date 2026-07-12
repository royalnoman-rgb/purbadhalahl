const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  useEffect(() => {
    // Fetch approved categories
    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {`;

const replaceStr = `  useEffect(() => {
    // Fetch subcategories
    const qSubCat = query(collection(db, 'subcategories'));
    const unsubSubCat = onSnapshot(qSubCat, (snapshot) => {
      const subCats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDynamicSubCategories(subCats);
    });

    // Fetch approved categories
    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {`;

code = code.replace(targetStr, replaceStr);

const cleanupTargetStr = `    return () => {
      unsubCat();
      unsubContact();
      unsubReview();
      unsubContributors();
    };`;

const cleanupReplaceStr = `    return () => {
      unsubSubCat();
      unsubCat();
      unsubContact();
      unsubReview();
      unsubContributors();
    };`;

code = code.replace(cleanupTargetStr, cleanupReplaceStr);

fs.writeFileSync('src/App.tsx', code);
