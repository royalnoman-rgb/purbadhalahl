const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `        {activeTab === 'reorder' && (
          <ReorderTab />
        )}`;

code = code.replace(target, '');

const properTarget = `        {activeTab === 'recycle' && (`;
const properEnd = `        )}

      </div>
    </div>
  );
}`;

// Actually let's just insert it before the last </div>
const pos = code.lastIndexOf('</div>\n    </div>\n  );\n}');
if (pos !== -1) {
  code = code.slice(0, pos) + target + "\n      " + code.slice(pos);
}
fs.writeFileSync('src/Admin.tsx', code);
