const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    `import { collection, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc, setDoc, increment, addDoc, onSnapshot } from 'firebase/firestore';`,
    `import { collection, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc, setDoc, increment, addDoc, onSnapshot, writeBatch } from 'firebase/firestore';`
  );

  fs.writeFileSync(file, content);
  console.log('Patched imports in ' + file);
}

patchFile('src/Admin.tsx');
