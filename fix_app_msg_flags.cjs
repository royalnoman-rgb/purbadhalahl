const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadAdminMessage: true
        });`;
const replace1 = `await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true
        });`;

code = code.replace(target1, replace1);

const target2 = `hasUnreadAdminMessage: true
        });
      }

      // Notify admin`;
const replace2 = `hasUnreadMessage: true
        });
      }

      // Notify admin`;
code = code.replace(target2, replace2);

fs.writeFileSync('src/App.tsx', code);
