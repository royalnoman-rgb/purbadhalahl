const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const contactMapping = `              filteredContacts.map((contact) => (`;
const newContactMapping = `              filteredContacts.map((contact, index) => (`;
code = code.replace(contactMapping, newContactMapping);

const contactAdminButtons = `                  <div className="flex flex-col gap-2">
                    <a
                      href={\`tel:\${contact.phone}\`}`;
const contactAdminButtonsReplacement = `                  <div className="flex flex-col gap-2 items-center">
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
                      href={\`tel:\${contact.phone}\`}`;
code = code.replace(contactAdminButtons, contactAdminButtonsReplacement);

fs.writeFileSync('src/App.tsx', code);
