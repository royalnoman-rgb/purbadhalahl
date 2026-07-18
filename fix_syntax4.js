import fs from 'fs';

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 4034:                  ))}
// 4035:                </div>
// 4036:                    </div>
// 4037:                  </div>
// 4038:                )}
// 4039:        </div>
// 4040:      )}
// 4041:
// 4042:    </div>
// 4043:    </>
// 4044:  );
// 4045: }

lines[4036] = `            </div>`;
lines[4037] = `          </div>`;
lines[4038] = `        </div>`;
lines[4039] = `      )}`;
lines[4040] = ``;
lines[4041] = `    </div>`;
lines[4042] = `  );`;
lines[4043] = `}`;
lines[4044] = ``;
lines[4045] = ``;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
