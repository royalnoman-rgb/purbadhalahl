const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `        } else {
          // Double check with a direct getDoc to prevent local cache race conditions / transient states`,
  `        } else {
          console.log("onSnapshot says doc does not exist for:", contributorPhone);
          // Double check with a direct getDoc to prevent local cache race conditions / transient states`
);
fs.writeFileSync('src/App.tsx', code);
