const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `                    <button 
                      onClick={() => handleSuggestEdit(contact)}
                      className="flex-shrink-0 bg-gray-50 hover:bg-emerald-50 active:bg-emerald-100 text-gray-500 hover:text-emerald-600 p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      title="নাম্বারটি সংশোধন করুন"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>`;

const replacement = `                    <button 
                      onClick={() => handleSuggestEdit(contact)}
                      className="flex-shrink-0 bg-gray-50 hover:bg-emerald-50 active:bg-emerald-100 text-gray-500 hover:text-emerald-600 p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      title="নাম্বারটি সংশোধন করুন"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={(e) => handleDeleteContactApp(contact.id, e)}
                        className="flex-shrink-0 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-500 hover:text-red-600 p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
