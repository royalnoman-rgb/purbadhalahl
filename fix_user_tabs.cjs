const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">অ্যাডমিন থেকে ম্যাসেজ</h3>`;
const rep1 = `                      </div>
                    )}
                  </div>
                  )}

                  {activeUserTab === 'messages' && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">অ্যাডমিন থেকে ম্যাসেজ</h3>`;
code = code.replace(target1, rep1);

const target2 = `                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>`;
const rep2 = `                      </button>
                    </div>
                  </div>
                  )}

                  {activeUserTab === 'contacts' && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>`;
code = code.replace(target2, rep2);

const target3 = `                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">`;
const rep3 = `                        ))}
                      </div>
                    )}
                  </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">`;
code = code.replace(target3, rep3);

fs.writeFileSync(file, code);
console.log('Fixed tabs!');
