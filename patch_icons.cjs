const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `               else if (subCat === 'আইনজীবী') IconComponent = Scale;`;
  const replacement = `               else if (subCat === 'আইনজীবী') IconComponent = Scale;
               else if (subCat === 'ফায়ার সার্ভিস') IconComponent = Flame;
               else if (subCat === 'থানা পুলিশ' || subCat === 'থানা / পুলিশ কন্ট্রোল রুম') IconComponent = Shield;
               else if (subCat === 'বিদ্যুৎ অফিস' || subCat === 'পবিস অভিযোগ কেন্দ্র') IconComponent = Zap;
               else if (subCat === 'হাসপাতাল জরুরী বিভাগ') IconComponent = Ambulance;`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}

patchFile('src/App.tsx');
