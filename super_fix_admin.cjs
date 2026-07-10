const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

// Fix `Public review deleted (ID: ${id)`
code = code.replace(/\`Public review deleted \(ID: \$\{id\)\`;/g, "\`Public review deleted (ID: \${id})\`;");

// Fix `Contributor deleted (ID: ${id)`
code = code.replace(/\`Contributor deleted \(ID: \$\{id\)\`;/g, "\`Contributor deleted (ID: \${id})\`;");

// Fix `Category deleted: ${catSnap.data().title || 'Unknown'`
code = code.replace(/\`Category deleted: \$\{catSnap\.data\(\)\.title \|\| 'Unknown'\)\`;/g, "\`Category deleted: \${catSnap.data().title || 'Unknown'}\`;");

// Fix `Feedback deleted from: ${fbSnap.data().name || 'Unknown'`
code = code.replace(/\`Feedback deleted from: \$\{fbSnap\.data\(\)\.name \|\| 'Unknown'\)\`;/g, "\`Feedback deleted from: \${fbSnap.data().name || 'Unknown'}\`;");

// Wait, the template literals are literally missing their ending `}` and `\``. 
// Let's look at the exact text from the output:
// `Public review deleted (ID: ${id)` -> wait, it's missing the closing backtick!
// Oh, the output of `cat` was `await logAdminAction(\`Public review deleted (ID: \${id)\`);` NO, wait, the backtick IS there!
// Let's look closely at `await logAdminAction(\`Public review deleted (ID: ${id)`);`
// Yes, it is `\${id)` instead of `\${id}`.
code = code.replace(/\$\{id\)\`;/g, "${id}\`;");
code = code.replace(/\|\| 'Unknown'\)\`;/g, "|| 'Unknown'}\`;");

// Now we have extra `}` at the end of the functions.
// `handleDeletePublicReview` has an extra `}` 
code = code.replace(/await logAdminAction\(\`Public review deleted \(ID: \$\{id\}\)\`\);\n      fetchData\(\);\n    \}\n  \};/g, 
  "await logAdminAction(`Public review deleted (ID: ${id})`);\n      fetchData();\n  };");

code = code.replace(/await logAdminAction\(\`Contributor deleted \(ID: \$\{id\}\)\`\);\n      fetchData\(\);\n    \}\n  \};/g, 
  "await logAdminAction(`Contributor deleted (ID: ${id})`);\n      fetchData();\n  };");

code = code.replace(/if\(catSnap\.exists\(\)\) await logAdminAction\(\`Category deleted: \$\{catSnap\.data\(\)\.title \|\| 'Unknown'\}\`\);\n      fetchData\(\);\n    \}\n  \};/g, 
  "if(catSnap.exists()) await logAdminAction(`Category deleted: ${catSnap.data().title || 'Unknown'}`);\n      fetchData();\n  };");

code = code.replace(/if\(fbSnap\.exists\(\)\) await logAdminAction\(\`Feedback deleted from: \$\{fbSnap\.data\(\)\.name \|\| 'Unknown'\}\`\);\n      fetchData\(\);\n    \}\n  \};/g, 
  "if(fbSnap.exists()) await logAdminAction(`Feedback deleted from: ${fbSnap.data().name || 'Unknown'}`);\n      fetchData();\n  };");

fs.writeFileSync('src/Admin.tsx', code);
