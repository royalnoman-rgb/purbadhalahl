const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStr = `                    <div key={contact.id || contact.phone} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 leading-tight">{contact.name}</h3>
                    {contact.details && (
                      <p className="text-sm text-gray-800 font-medium mt-1 mb-0.5">{contact.details}</p>
                    )}
                    {contact.subDetails && (
                      <p className="text-sm text-gray-500 mb-1">{contact.subDetails}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <a href={\`tel:\${contact.phone}\`} className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors hover:bg-emerald-100 active:bg-emerald-200">
                        <Phone className="w-4 h-4" />
                        {toBengaliDigits(contact.phone)}
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    {isAdmin && (
                      <div className="flex gap-1 mb-1">
                        <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'up'); }} disabled={index === 0} className="bg-gray-100 text-gray-700 p-1.5 rounded-full disabled:opacity-30">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'down'); }} disabled={index === filteredContacts.length - 1} className="bg-gray-100 text-gray-700 p-1.5 rounded-full disabled:opacity-30">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <a
                      href={\`tel:\${contact.phone}\`}
                      className="flex-shrink-0 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 p-3 rounded-full transition-colors flex items-center justify-center"
                      aria-label={\`Call \${contact.name}\`}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <a
                      href={\`https://wa.me/\${contact.phone.replace(/[^0-9+]/g, '')}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-green-50 hover:bg-green-100 active:bg-green-200 text-green-600 p-3 rounded-full transition-colors flex items-center justify-center"
                      aria-label={\`WhatsApp \${contact.name}\`}
                      title="হোয়াটসঅ্যাপে মেসেজ দিন"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    <button 
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

const replaceStr = `                    <div key={contact.id || contact.phone} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col gap-2.5 group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">{contact.name}</h3>
                          {contact.details && (
                            <p className="text-[13px] text-gray-700 font-medium mt-0.5">{contact.details}</p>
                          )}
                          {contact.subDetails && (
                            <p className="text-[12px] text-gray-500 mt-0.5">{contact.subDetails}</p>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
                            <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'up'); }} disabled={index === 0} className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 p-1 hover:bg-white rounded">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'down'); }} disabled={index === filteredContacts.length - 1} className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 p-1 hover:bg-white rounded">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <div className="bg-emerald-50 p-1 rounded-md">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-[14px] tracking-wide">{toBengaliDigits(contact.phone)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a href={\`tel:\${contact.phone}\`} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="কল করুন">
                            <Phone className="w-4 h-4" />
                          </a>
                          <a href={\`https://wa.me/\${contact.phone.replace(/[^0-9+]/g, '')}\`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="হোয়াটসঅ্যাপ">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          {!isAdmin && (
                            <button onClick={() => handleSuggestEdit(contact)} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors" title="সংশোধন করুন">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {isAdmin && (
                            <>
                              <button onClick={() => handleSuggestEdit(contact)} className="p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors" title="সংশোধন করুন">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => handleDeleteContactApp(contact.id, e)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="ডিলিট করুন">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>`;
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
