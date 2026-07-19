const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        } else {
          console.log("onSnapshot says doc does not exist for:", contributorPhone);
          // Double check with a direct getDoc to prevent local cache race conditions / transient states`;

const replacement = `        } else {
          if (docSnap.metadata.fromCache) {
             console.log("Ignoring cache miss for user");
             return;
          }
          console.log("onSnapshot says doc does not exist for:", contributorPhone);
          // Double check with a direct getDoc to prevent local cache race conditions / transient states`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed cache miss logout');
} else {
  console.log('Target not found');
}
