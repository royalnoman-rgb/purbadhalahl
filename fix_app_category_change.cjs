const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `onChange={(e) => setNewCategory(e.target.value)}`;
// Wait, this could be anywhere, I better use a more specific string
const specificTarget = `<select
                      required value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >`;

const specificReplace = `<select
                      required value={newCategory} onChange={(e) => { setNewCategory(e.target.value); setNewSubCategory(''); setNewBloodGroup(''); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >`;

if (code.includes(specificTarget)) {
  code = code.replace(specificTarget, specificReplace);
  console.log("Successfully fixed category onChange");
} else {
  console.log("Could not find specificTarget");
}

fs.writeFileSync('src/App.tsx', code);
