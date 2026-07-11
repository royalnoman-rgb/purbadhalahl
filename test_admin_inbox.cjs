const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetTabButtons = `<button onClick={() => setActiveTab('requests')}`;
const inboxTabBtn = `<button onClick={() => setActiveTab('inbox')} className={\`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === 'inbox' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}>ইনবক্স</button>
          <button onClick={() => setActiveTab('requests')}`;
code = code.replace(targetTabButtons, inboxTabBtn);

const targetInboxSection = `{activeTab === 'requests' && (`;
const inboxSection = `{activeTab === 'inbox' && (
          <section>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">অ্যাডমিন ইনবক্স</h2>
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {contributors.filter(c => c.messages && c.messages.length > 0).sort((a,b) => {
                const aLast = a.messages[a.messages.length-1].createdAt;
                const bLast = b.messages[b.messages.length-1].createdAt;
                return new Date(bLast).getTime() - new Date(aLast).getTime();
              }).map(cont => (
                <div key={cont.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {cont.avatar ? (
                          <img src={cont.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                        ) : (
                          <UserCircle className="w-6 h-6 text-emerald-600" />
                        )}
                        <span className="flex items-center">
                          {cont.name}
                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600">{cont.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setExpandedContributorId(expandedContributorId === cont.id ? null : cont.id);
                          if (cont.hasUnreadAdminMessage) {
                            handleMarkContributorMessageAsRead(cont.id);
                          }
                        }} 
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 relative"
                        title="Messages"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {cont.hasUnreadAdminMessage && (
                          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedContributorId === cont.id && (
                    <div className="mt-4 border-t pt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
                          {cont.messages?.map((msg: any) => (
                            <div key={msg.id} className={\`p-3 rounded-lg text-sm \${msg.sender === 'admin' ? 'bg-blue-100 ml-8' : 'bg-white border border-gray-200 mr-8'}\`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-[11px] text-gray-700">{msg.sender === 'admin' ? 'অ্যাডমিন' : cont.name}</span>
                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                              </div>
                              <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={adminMessageText}
                            onChange={(e) => setAdminMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSendAdminMessage(cont.id);
                            }}
                          />
                          <button
                            onClick={() => handleSendAdminMessage(cont.id)}
                            disabled={!adminMessageText.trim()}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {contributors.filter(c => c.messages && c.messages.length > 0).length === 0 && (
                <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">ইনবক্সে কোনো ম্যাসেজ নেই।</p>
              )}
            </div>
          </section>
        )}
        {activeTab === 'requests' && (`;
code = code.replace(targetInboxSection, inboxSection);

fs.writeFileSync('src/Admin.tsx', code);
