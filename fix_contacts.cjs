const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                    <div key={contact.id || contact.phone} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col gap-2.5 group hover:shadow-md transition-shadow">
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

const replaceStr = `                    <div key={contact.id || contact.phone} className="bg-white rounded-lg p-2.5 sm:p-3 shadow-sm border border-gray-100 flex items-center justify-between gap-3 hover:shadow-md transition-shadow group">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-[14px] sm:text-[15px] truncate">{contact.name}</h3>
                          <div className="hidden sm:flex items-center gap-1.5 text-emerald-700 font-medium whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded text-[13px]">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {toBengaliDigits(contact.phone)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5">
                          {contact.details && (
                            <p className="text-[12px] sm:text-[13px] text-gray-600 truncate">{contact.details}</p>
                          )}
                          {contact.details && contact.subDetails && <span className="hidden sm:inline text-gray-300">•</span>}
                          {contact.subDetails && (
                            <p className="text-[11px] sm:text-[12px] text-gray-500 truncate">{contact.subDetails}</p>
                          )}
                        </div>
                        
                        <div className="flex sm:hidden items-center gap-1.5 text-emerald-700 font-medium mt-1 text-[13px]">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {toBengaliDigits(contact.phone)}
                        </div>
                      </div>

                      <div className="flex flex-row items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <a href={\`tel:\${contact.phone}\`} className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="কল করুন">
                            <Phone className="w-4 h-4" />
                          </a>
                          <a href={\`https://wa.me/\${contact.phone.replace(/[^0-9+]/g, '')}\`} target="_blank" rel="noopener noreferrer" className="p-2 sm:p-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="হোয়াটসঅ্যাপ">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!isAdmin && (
                            <button onClick={() => handleSuggestEdit(contact)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors" title="সংশোধন করুন">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          
                          {isAdmin && (
                            <>
                              <button onClick={() => handleSuggestEdit(contact)} className="p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors" title="সংশোধন করুন">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => handleDeleteContactApp(contact.id, e)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="ডিলিট করুন">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="flex flex-col ml-1 bg-gray-50 rounded border border-gray-100">
                                <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'up'); }} disabled={index === 0} className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 p-0.5 hover:bg-gray-200 rounded-t">
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleMoveContact(index, 'down'); }} disabled={index === filteredContacts.length - 1} className="text-gray-400 hover:text-emerald-600 disabled:opacity-30 p-0.5 hover:bg-gray-200 rounded-b border-t border-gray-100">
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Successfully replaced contact list design");
} else {
  console.log("Could not find target string for contact list");
}
