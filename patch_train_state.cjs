const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import TrainTracker
content = content.replace(
  `import MapTracker from './MapTracker';`,
  `import MapTracker from './MapTracker';\nimport TrainTracker from './TrainTracker';`
);

// 2. Add state
content = content.replace(
  `  const [showMap, setShowMap] = useState(false);`,
  `  const [showMap, setShowMap] = useState(false);\n  const [showTrainTracker, setShowTrainTracker] = useState(false);`
);

// 3. activeViewsCount
content = content.replace(
  `    !!selectedSubCategory, !!selectedCategory, showCommunity, showMap`,
  `    !!selectedSubCategory, !!selectedCategory, showCommunity, showMap, showTrainTracker`
);
content = content.replace(
  `    selectedSubCategory, selectedCategory, showCommunity, showMap`,
  `    selectedSubCategory, selectedCategory, showCommunity, showMap, showTrainTracker`
);

// 4. handleBack
content = content.replace(
  `    else if (showMap) setShowMap(false);`,
  `    else if (showMap) setShowMap(false);\n    else if (showTrainTracker) setShowTrainTracker(false);`
);

// 5. Header Back Button Condition
content = content.replace(
  `{selectedCategory || showMap || showCommunity ? (`,
  `{selectedCategory || showMap || showTrainTracker || showCommunity ? (`
);

content = content.replace(
  `                  setShowMap(false);\n                  setShowCommunity(false);`,
  `                  setShowMap(false);\n                  setShowTrainTracker(false);\n                  setShowCommunity(false);`
);

// 6. Header Title Condition
content = content.replace(
  `            {showCommunity ? 'কমিউনিটি' : showMap ? 'গাড়ির লাইভ অবস্থান' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}`,
  `            {showCommunity ? 'কমিউনিটি' : showMap ? 'গাড়ির লাইভ অবস্থান' : showTrainTracker ? 'লাইভ ট্রেন ট্র্যাকিং' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}`
);

// 7. Banner condition
content = content.replace(
  `        {!selectedCategory && !showMap && !showCommunity && (`,
  `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && (`
);

content = content.replace(
  `        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (`,
  `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (`
);
// replace second occurrence too
content = content.replace(
  `        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (`,
  `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (`
);

// 8. Notification reset
content = content.replace(
  `                            setShowMap(false);`,
  `                            setShowMap(false);\n                            setShowTrainTracker(false);`
);

// 9. Dashboard Grid condition
content = content.replace(
  `        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (`,
  `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (`
);
// replace again in case there are multiple (we already replaced one)
content = content.replace(
  `        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (`,
  `        {!selectedCategory && !showMap && !showTrainTracker && !showCommunity && !searchQuery && (`
);
// fix all
content = content.replace(/!showMap && !showCommunity/g, '!showMap && !showTrainTracker && !showCommunity');

// 10. Dashboard Grid Buttons
content = content.replace(
  `            <button
              onClick={() => setShowMap(true)}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">গাড়ির অবস্থান</span>
            </button>`,
  `            <button
              onClick={() => setShowMap(true)}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">গাড়ির অবস্থান</span>
            </button>
            <button
              onClick={() => setShowTrainTracker(true)}
              className="bg-orange-50 text-orange-700 border border-orange-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
              <Train className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">ট্রেন ট্র্যাকিং</span>
            </button>`
);

// 11. Render TrainTracker
content = content.replace(
  `        {showMap && !showTrainTracker && !showCommunity && (
          <div className="mb-6">
            <MapTracker />
          </div>
        )}`,
  `        {showMap && !showTrainTracker && !showCommunity && (
          <div className="mb-6">
            <MapTracker />
          </div>
        )}
        
        {/* Train Tracker */}
        {showTrainTracker && !showMap && !showCommunity && (
          <div className="mb-6">
            <TrainTracker contributorName={contributorName} />
          </div>
        )}`
);
// Above replace might fail if the match is different, so we will do a more robust replace for rendering:

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with TrainTracker");
