const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `<span className="font-semibold text-[11px] text-gray-700">{reply.sender === 'user' ? 'আপনি' : 'অ্যাডমিন'}</span>`;
const replace = `<span className="font-semibold text-[11px] text-gray-700 flex items-center">{reply.sender === 'user' ? 'আপনি' : 'অ্যাডমিন'} {reply.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-1" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}</span>`;

code = code.replace(target, replace);

const targetMsg = `<span className="font-semibold text-[11px] text-emerald-700">{msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}</span>`;
const replaceMsg = `<span className="font-semibold text-[11px] text-emerald-700 flex items-center">{msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'} {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-1" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>}</span>`;

code = code.replace(targetMsg, replaceMsg);

fs.writeFileSync(file, code);
