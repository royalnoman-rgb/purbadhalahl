const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);',
  'const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);\n  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);'
);

// also in header back button:
// if (selectedBloodGroup) { setSelectedBloodGroup(null); } else if (selectedSubCategory) { setSelectedSubCategory(null); }
content = content.replace(
  '                if (selectedSubCategory) {\n                  setSelectedSubCategory(null);\n                } else {',
  '                if (selectedBloodGroup) {\n                  setSelectedBloodGroup(null);\n                } else if (selectedSubCategory) {\n                  setSelectedSubCategory(null);\n                } else {'
);

fs.writeFileSync('src/App.tsx', content);
console.log("states patched");
