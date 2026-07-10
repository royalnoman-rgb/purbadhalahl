const fs = require('fs');

function addConfirm(file, funcNames, msg) {
  let code = fs.readFileSync(file, 'utf8');
  for (const funcName of funcNames) {
    const regex = new RegExp(`(const ${funcName} = async \\([^)]+\\) => \\{)`);
    code = code.replace(regex, `$1\n    if (!window.confirm('${msg}')) return;`);
  }
  fs.writeFileSync(file, code);
}

addConfirm('src/Admin.tsx', [
  'handleDeleteContact',
  'handleDeletePublicReview',
  'handleDeleteContributor',
  'handleDeleteCategory',
  'handleDeleteFeedback'
], 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?');

addConfirm('src/App.tsx', [
  'handleDeleteCategoryApp',
  'handleDeleteContactApp'
], 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?');

