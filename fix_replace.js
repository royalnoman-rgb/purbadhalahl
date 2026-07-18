import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The block around 3530 currently looks like:
/*
3530:                             </div>
3531: 
3532:                             );
3533:                           })} 
3534:                         </div>
3535:                      )}
3536:                   </div>
3537:                   </div>
3538:                   </div>
3539:                 )}
3540:  <div className="mb-4">
*/

// I need it to be:
/*
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeUserTab === 'contacts' && (
                  <div className="mb-4">
*/

let searchStr = `                            </div>\n\n                            );\n                          })} \n                        </div>\n                     )}\n                  </div>\n                  </div>\n                  </div>\n                )}\n <div className="mb-4">`;

let replaceStr = `                            </div>\n                          );\n                        })}\n                      </div>\n                    )}\n                  </div>\n                </div>\n              )}\n              {activeUserTab === 'contacts' && (\n                <div className="mb-4">`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  console.log("Replaced block 1 successfully.");
} else {
  console.log("Could not find block 1!");
}

fs.writeFileSync('src/App.tsx', content);
