const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /(\.includes\(subCat\)\) IconComponent = Droplets;\s*return \(\s*<div key=\{subCat\} className="relative group">)/,
    "else if (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'].includes(subCat)) IconComponent = Droplets;\n               const subCatContactCount = filteredContacts.filter(c => (c.subCategory || 'অন্যান্য') === subCat).length;\n               return (\n              <div key={subCat} className=\"relative group\">"
  );
  
  // also fix the replaced `else if` since we replaced the whole match but the match only caught part of it. Wait, the match catches `includes(subCat)) IconComponent = Droplets;...` which means we should just replace that.
  
  content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /else if \(\['A\+', 'A-', 'B\+', 'B-', 'O\+', 'O-', 'AB\+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'\]\.includes\(subCat\)\) IconComponent = Droplets;\s*return \(/,
    "else if (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'].includes(subCat)) IconComponent = Droplets;\n               const subCatContactCount = filteredContacts.filter(c => (c.subCategory || 'অন্যান্য') === subCat).length;\n               return ("
  );

  content = content.replace(
    /<span className="text-sm font-medium text-center text-gray-800">\{subCat\}<\/span>/,
    `<div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-center text-gray-800">{subCat}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{toBengaliDigits(subCatContactCount.toString())} টি নাম্বার</span>
                  </div>`
  );
  
  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
}

patchFile('src/App.tsx');
