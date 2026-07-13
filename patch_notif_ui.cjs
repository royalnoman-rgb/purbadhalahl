const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `<h4 className="font-semibold text-gray-900 text-xs mb-1">{notif.title}</h4>`;
  const replacement = `<h4 className="font-semibold text-gray-900 text-xs mb-1 relative w-fit">
                          {notif.title}
                          {notif.senderPhone && onlineUsers.includes(notif.senderPhone) && <span className="absolute -top-0.5 -right-2.5 w-2 h-2 bg-green-500 rounded-full border border-white"></span>}
                        </h4>`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}

patchFile('src/App.tsx');
patchFile('src/Admin.tsx');
