import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 3900 is `      )}` in my 1-based view, which is lines[3899].
// Let's replace lines[3899] with `</div>\n          </div>\n        </div>\n      )}`.
lines[3899] = `            </div>\n          </div>\n        </div>\n      )}`;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
