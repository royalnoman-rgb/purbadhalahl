const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<span className="font-semibold text-[11px] text-emerald-700 flex items-center">{msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'} {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-1" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}</span>`;

const replace = `<span className="font-semibold text-[11px] text-emerald-700 flex items-center">
                                <span className="relative">
                                  {msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}
                                  {msg.sender === 'admin' && onlineUsers.includes('admin') && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                  {msg.sender !== 'admin' && onlineUsers.includes(contributorPhone) && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                </span>
                                {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-3" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}
                              </span>`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
