const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const qSubCat = query(collection(db, 'subcategories'));
    const unsubSubCat = onSnapshot(qSubCat, (snapshot) => {
      const subCats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDynamicSubCategories(subCats);
    });

    // Fetch approved categories
    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
      setDynamicCategories(cats);
    });

    // Fetch approved contacts
    const qContact = query(collection(db, 'contacts'), where('status', '==', 'approved'));
    const unsubContact = onSnapshot(qContact, (snapshot) => {
      const conts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      setDynamicContacts(conts);
    });

    // Fetch public reviews
    const qReview = query(collection(db, 'public_reviews'), orderBy('createdAt', 'desc'));
    const unsubReview = onSnapshot(qReview, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
      setPublicReviews(revs);
    });

    // Fetch top 10 contributors for verified badges and leaderboard globally
    const qTopContributors = query(collection(db, 'contributors'), orderBy('points', 'desc'), limit(20));
    const unsubTopContributors = onSnapshot(qTopContributors, (snapshot) => {
      const contributors = snapshot.docs.map(doc => ({ ...doc.data() as any, id: doc.id }));
      const activeContributors = contributors.filter(c => c.points > 0 || c.approvedCount > 0);
      setTopContributors(activeContributors.slice(0, 10));
    });

    return () => {
      unsubCat();
      unsubContact();
      unsubReview();
      unsubTopContributors();
    }`;

const replacement = `    const fetchWithCache = async (cacheKey, q, setter, mapFn, filterFn = null) => {
      try {
        const cached = safeStorage.getItem(cacheKey);
        const cacheTime = safeStorage.getItem(cacheKey + '_time');
        const now = Date.now();
        
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 30 * 60 * 1000) { // 30 mins TTL
          setter(JSON.parse(cached));
          return;
        }

        const snapshot = await getDocs(q);
        let items = snapshot.docs.map(mapFn);
        if (filterFn) items = filterFn(items);
        
        setter(items);
        safeStorage.setItem(cacheKey, JSON.stringify(items));
        safeStorage.setItem(cacheKey + '_time', now.toString());
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };

    fetchWithCache(
      'subCats_cache',
      query(collection(db, 'subcategories')),
      setDynamicSubCategories,
      doc => ({ ...doc.data(), id: doc.id })
    );

    fetchWithCache(
      'cats_cache',
      query(collection(db, 'categories'), where('status', '==', 'approved')),
      setDynamicCategories,
      doc => ({ ...doc.data(), id: doc.id })
    );

    fetchWithCache(
      'contacts_cache',
      query(collection(db, 'contacts'), where('status', '==', 'approved')),
      setDynamicContacts,
      doc => ({ ...doc.data(), id: doc.id })
    );

    fetchWithCache(
      'reviews_cache',
      query(collection(db, 'public_reviews'), orderBy('createdAt', 'desc')),
      setPublicReviews,
      doc => ({ ...doc.data(), id: doc.id })
    );

    fetchWithCache(
      'topContributors_cache',
      query(collection(db, 'contributors'), orderBy('points', 'desc'), limit(20)),
      setTopContributors,
      doc => ({ ...doc.data(), id: doc.id }),
      items => items.filter(c => (c.points > 0 || c.approvedCount > 0)).slice(0, 10)
    );

    return () => {};`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced successfully");
} else {
  console.log("Target not found");
}
