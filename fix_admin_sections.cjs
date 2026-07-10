const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\{\/\* Pending Categories \*\/\}\n\s*\{activeTab === 'requests' && \(\n\s*<section>\n\s*<section>/, 
  "{/* Pending Categories */}\n        {activeTab === 'requests' && (\n          <section>"
);

code = code.replace(/\{\/\* Pending Contacts \*\/\}\n\s*\{activeTab === 'requests' && \(\n\s*<section>/,
  "{/* Pending Contacts */}\n        {activeTab === 'requests' && (\n          <section>"
);

code = code.replace(/\{\/\* Feedbacks \*\/\}\n\s*\{activeTab === 'feedbacks' && \(\n\s*<section>/,
  "{/* Feedbacks */}\n        {activeTab === 'feedbacks' && (\n          <section>"
);

code = code.replace(/\{\/\* Reviews \*\/\}\n\s*\{activeTab === 'reviews' && \(\n\s*<section>/,
  "{/* Reviews */}\n        {activeTab === 'reviews' && (\n          <section>"
);

code = code.replace(/\{\/\* Contributors Messages \*\/\}\n\s*\{activeTab === 'contributors' && \(\n\s*<section>/,
  "{/* Contributors Messages */}\n        {activeTab === 'contributors' && (\n          <section>"
);

code = code.replace(/\{\/\* Admin History \*\/\}\n\s*\{activeTab === 'history' && \(\n\s*<section>/,
  "{/* Admin History */}\n        {activeTab === 'history' && (\n          <section>"
);

fs.writeFileSync(file, code);
