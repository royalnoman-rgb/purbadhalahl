import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 3530:                             </div>
// 3531:                             );
// 3532:                           })}
// 3533:                         </div>
// 3534:                     </div>
// 3535:                   </div>
// 3536:                 )}

lines[3533] = `                    </div>`;
lines[3534] = `                  </div>`;
lines[3535] = `                )}`;
lines[3536] = ``; // deleted extra

// 3890:                             </div>
// 3891:                           </div>
// 3892:                         </div>
// 3893:                       ))}
// 3894:                     </div>
// 3895:                     </div>
// 3896:                   )}
// 3897:                 </>
// 3898:               )}
lines[3894] = `                  )}`;
lines[3895] = `                </>`;
lines[3896] = `              )}`;
lines[3897] = ``;
lines[3898] = ``;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
