const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace {activeTab === 'reviews' && ( ... } because it's not there!
code = code.replace(/\{\/\* Public Reviews \*\/\}\n\s*<section>/,
  "{/* Public Reviews */}\n        {activeTab === 'reviews' && (\n          <section>"
);

// Check if Public Reviews has closing section
code = code.replace(/<h2 className="text-lg font-semibold mb-4 border-b pb-2">পাবলিক রিভিও সমূহ[\s\S]*?<\/section>/, (match) => {
  return match + "\n        )}";
});

// Admin History closing might not have )}
// Also verify Contributors
fs.writeFileSync(file, code);
