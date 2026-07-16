const fs = require('fs');

let adminContent = fs.readFileSync('src/Admin.tsx', 'utf8');

adminContent = adminContent.replace(
  `{activeTab === 'inbox' && (`,
  `{activeTab === 'inbox' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'feedbacks' && (`,
  `{activeTab === 'feedbacks' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'reviews' && (`,
  `{activeTab === 'reviews' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'contributors' && (`,
  `{activeTab === 'contributors' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'history' && (`,
  `{activeTab === 'history' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'recycle' && (`,
  `{activeTab === 'recycle' && isSuperAdmin && (`
);

adminContent = adminContent.replace(
  `{activeTab === 'data' && (`,
  `{activeTab === 'data' && isSuperAdmin && (`
);

fs.writeFileSync('src/Admin.tsx', adminContent);

console.log("Patched admin content");
