const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `               else if (subCat === 'ফায়ার সার্ভিস') IconComponent = Flame;`;
  const replacement = `               else if (subCat === 'ফায়ার সার্ভিস' || subCat === 'ফায়ার সার্ভিস') IconComponent = Flame;`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}

patchFile('src/App.tsx');
