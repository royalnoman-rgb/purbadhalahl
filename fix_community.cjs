const fs = require('fs');
let code = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `                            <span>{comment.loves?.length > 0 ? comment.loves.length : 'লাভ'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>`;
const replace = `                            <span>{comment.loves?.length > 0 ? comment.loves.length : 'লাভ'}</span>
                          </button>
                        </div>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>`;
code = code.replace(target, replace);
fs.writeFileSync('src/Community.tsx', code);
