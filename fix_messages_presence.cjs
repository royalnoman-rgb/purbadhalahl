const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const messageTarget = `                                {msg.senderAvatar ? (
                                  <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                    <UserCircle className="w-4 h-4" />
                                  </div>
                                )}`;

const messageReplace = `                                <div className="relative shrink-0">
                                  {msg.senderAvatar ? (
                                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                      <UserCircle className="w-4 h-4" />
                                    </div>
                                  )}
                                  {onlineUsers.includes(msg.senderPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>`;

code = code.replace(messageTarget, messageReplace);

fs.writeFileSync('src/App.tsx', code);
