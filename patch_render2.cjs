const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `        {/* Live Tracking Map */}
        {showMap && !showCommunity && (
          <div className="mb-8">
            <MapTracker />
          </div>
        )}`,
  `        {/* Live Tracking Map */}
        {showMap && !showCommunity && !showTrainTracker && (
          <div className="mb-8">
            <MapTracker />
          </div>
        )}
        
        {/* Train Tracker */}
        {showTrainTracker && !showMap && !showCommunity && (
          <div className="mb-8">
            <TrainTracker contributorName={contributorName} />
          </div>
        )}`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched render 2");
