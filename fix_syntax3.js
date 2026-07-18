import fs from 'fs';

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// For Reviews Modal (around 3893-3901)
// Looking at the output:
// 3893:                      ))}
// 3894:                    </div>
// 3895:                    </div>
// 3896:                  </div>
// 3897:                )}
// 3898:            </div>
// 3899:          </div>
// 3900:        </div>
// 3901:      )}

// It should be:
// 3893:                      ))}
// 3894:                    </div>
// 3895:                  )}
// 3896:                </>
// 3897:              )}
// 3898:            </div>
// 3899:          </div>
// 3900:        </div>
// 3901:      )}

lines[3895] = `                  )}`;
lines[3896] = `                </>`;
lines[3897] = `              )}`;

fs.writeFileSync('src/App.tsx', lines.join('\n'));
