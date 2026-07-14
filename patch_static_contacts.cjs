const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

// Replace for "পূর্বধলা জে. এম. পাইলট উচ্চ বিদ্যালয়"
content = content.replace(
  /"subCategory": "স্কুল, কলেজ ও মাদ্রাসা"/g,
  function(match, offset, string) {
    if (string.substring(offset - 100, offset).includes('পূর্বধলা জে. এম. পাইলট উচ্চ বিদ্যালয়')) {
      return '"subCategory": "স্কুল"';
    } else if (string.substring(offset - 100, offset).includes('পূর্বধলা সরকারি কলেজ')) {
      return '"subCategory": "কলেজ"';
    }
    // generic fallback just in case
    return '"subCategory": "স্কুল"';
  }
);

fs.writeFileSync('src/data.ts', content);
console.log("Static contacts patched");
