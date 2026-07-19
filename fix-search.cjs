const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update filteredContacts
code = code.replace(
  `    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);`,
  `    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery) || c.phone.includes(toEnglishDigits(searchQuery));`
);

// Update header back button condition
code = code.replace(
  `          {selectedCategory || showMap || showTrainTracker || showCommunity ? (`,
  `          {selectedCategory || showMap || showTrainTracker || showCommunity || searchQuery ? (`
);

// Update header back button onClick
code = code.replace(
  `              onClick={() => {
                if (selectedBloodGroup) {
                  setSelectedBloodGroup(null);
                } else if (selectedSubCategory) {
                  setSelectedSubCategory(null);
                } else {
                  setSelectedCategory(null);
                  setShowMap(false);
                  setShowTrainTracker(false);
                  setShowCommunity(false);
                }
              }}`,
  `              onClick={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else if (selectedBloodGroup) {
                  setSelectedBloodGroup(null);
                } else if (selectedSubCategory) {
                  setSelectedSubCategory(null);
                } else {
                  setSelectedCategory(null);
                  setShowMap(false);
                  setShowTrainTracker(false);
                  setShowCommunity(false);
                }
              }}`
);

// Add to handleBack if not there
code = code.replace(
  `    else if (selectedCategory) setSelectedCategory(null);
    else if (isContributorProfileOpen) setIsContributorProfileOpen(false);`,
  `    else if (selectedCategory) setSelectedCategory(null);
    else if (searchQuery) setSearchQuery('');
    else if (isContributorProfileOpen) setIsContributorProfileOpen(false);`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Search logic updated');
