const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Revert all occurrences of the broken replacement
  code = code.replace(/<\/div>\n    <\/>\n  \);\n\}/g, "</div>\n  );\n}");
  
  // Now only replace the LAST occurrence for App and Community
  const lastIndex = code.lastIndexOf("</div>\n  );\n}");
  if (lastIndex !== -1) {
    code = code.substring(0, lastIndex) + "</div>\n    </>\n  );\n}" + code.substring(lastIndex + "</div>\n  );\n}".length);
  }
  
  fs.writeFileSync(file, code);
}

fix('src/App.tsx');
fix('src/Community.tsx');
