import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/<\/div>\n\s+\)\}\n\s+<\/>\n\s+\)\}/g, `</div>\n                    </div>\n                  </div>\n                )}`);
content = content.replace(/<\/div>\n\s+\)\}\n\s+<\/>\n\s+\)\}\n\s+<\/div>\n\s+\)\}\n\n\s+<\/div>\n\s+<\/>/g, `</div>\n              </div>\n            </div>\n          )}\n        </div>\n      )}\n\n    </div>\n  );`);

fs.writeFileSync('src/App.tsx', content);
