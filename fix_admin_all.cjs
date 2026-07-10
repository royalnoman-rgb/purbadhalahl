const fs = require('fs');

const file = 'src/Admin.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\{\/\* Pending Categories \*\/\}\s*(\{activeTab === 'requests' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Pending Categories */}\n        {activeTab === 'requests' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Pending Contacts \*\/\}\s*(\{activeTab === 'requests' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Pending Contacts */}\n        {activeTab === 'requests' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Feedbacks \*\/\}\s*(\{activeTab === 'feedbacks' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Feedbacks */}\n        {activeTab === 'feedbacks' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Admin History \*\/\}\s*(\{activeTab === 'history' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Admin History */}\n        {activeTab === 'history' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Public Reviews \*\/\}\s*(\{activeTab === 'reviews' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Public Reviews */}\n        {activeTab === 'reviews' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Contributors \*\/\}\s*(\{activeTab === 'contributors' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Contributors */}\n        {activeTab === 'contributors' && (\n          <section>$2</section>\n        )}"
);

code = code.replace(/\{\/\* Contributors Messages \*\/\}\s*(\{activeTab === 'contributors' && \(\s*)?<section>([\s\S]*?)<\/section>\s*(\)\})?/, 
  "{/* Contributors Messages */}\n        {activeTab === 'contributors' && (\n          <section>$2</section>\n        )}"
);

// We need to clean up closing tag if there are extra `</section>\n )}`
// The easiest way is just to see if we can compile.
fs.writeFileSync(file, code);
