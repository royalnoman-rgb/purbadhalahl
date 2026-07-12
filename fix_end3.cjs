const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                    )}
                  </div>
                ))}
                </div>
              ))
            ) : (`;
const replaceStr = `                    )}
                  </div>
                </div>
                ))}
                </div>
              ))
            ) : (`;

if(code.includes(targetStr)) {
    code = code.replace(targetStr, replaceStr);
} else {
    console.log("Not found! Let's just sed");
}

fs.writeFileSync('src/App.tsx', code);
