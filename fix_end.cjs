const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                </div>
              ))
            ) : (`;
const replaceStr = `                </div>
              )))
            ) : (`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/App.tsx', code);
