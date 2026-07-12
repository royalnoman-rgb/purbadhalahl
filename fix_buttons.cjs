const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStr = `<button
                  onClick={() => setSelectedSubCategory(subCat)}
                  className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none"
                >`;

const replaceStr = `<div
                  onClick={() => setSelectedSubCategory(subCat)}
                  className="bg-white hover:bg-gray-50 border border-gray-100 w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none cursor-pointer"
                >`;

const searchStrEnd = `                  )}
                </button>
              )}
              </div>
            );
            })})()}
          </div>`;

const replaceStrEnd = `                  )}
                </div>
              )}
              </div>
            );
            })})()}
          </div>`;

if (code.includes(searchStr) && code.includes(searchStrEnd)) {
  code = code.replace(searchStr, replaceStr);
  code = code.replace(searchStrEnd, replaceStrEnd);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success replacing buttons");
} else {
  console.log("Failed to find strings to replace.");
}
