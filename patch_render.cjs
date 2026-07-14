const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

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

fs.writeFileSync('src/App.tsx', content);
console.log("Patched render");
