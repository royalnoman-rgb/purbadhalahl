const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectMatch = code.match(/  useEffect\(\(\) => \{\n    if \(contributorPhone && messaging\) \{[\s\S]*?  \}, \[contributorPhone\]\);\n/);
if (effectMatch) {
  const effectCode = effectMatch[0];
  code = code.replace(effectCode, '');
  
  // Find a good place to insert it, e.g. after `const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);`
  const insertTarget = "const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);";
  code = code.replace(insertTarget, insertTarget + "\n\n" + effectCode);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed!");
} else {
  console.log("Could not find effect code to move.");
}
