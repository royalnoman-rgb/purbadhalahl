const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For Categories mapping
const catMapping = `{allCategories.map((category) => {`;
const newCatMapping = `{allCategories.map((category, index) => {`;
code = code.replace(catMapping, newCatMapping);

// Add arrow up / down icons to imports if needed
if (!code.includes("ArrowUp")) {
  code = code.replace("import { \n  Shield", "import { ArrowUp, ArrowDown, \n  Shield");
}

const catAdminButtons = `                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">`;
const catAdminButtonsReplacement = `                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => handleMoveCategory(e, index, 'up')} disabled={index === 0} className="bg-gray-100 text-gray-700 p-1.5 rounded-full disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleMoveCategory(e, index, 'down')} disabled={index === allCategories.length - 1} className="bg-gray-100 text-gray-700 p-1.5 rounded-full disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>`;
code = code.replace(catAdminButtons, catAdminButtonsReplacement);

fs.writeFileSync('src/App.tsx', code);
