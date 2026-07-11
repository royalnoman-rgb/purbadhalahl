const fs = require('fs');

function fixTypes(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/snapshot\.docs\.map\(d(oc)? => \(\{ id: d(oc)?\.id, \.\.\.d(oc)?\.data\(\) \}\)\)/g, 'snapshot.docs.map(d$1 => ({ id: d$1.id, ...d$1.data() } as any))');
  fs.writeFileSync(file, code);
}

fixTypes('src/App.tsx');
fixTypes('src/Admin.tsx');
