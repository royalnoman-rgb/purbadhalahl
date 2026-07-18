import fs from 'fs';
let content = fs.readFileSync('src/TrainTracker.tsx', 'utf8');
content = content.replace('toBengaliDigits(diff)', 'toBengaliDigits(diff.toString())');
content = content.replace('toBengaliDigits(hours)', 'toBengaliDigits(hours.toString())');
fs.writeFileSync('src/TrainTracker.tsx', content);
