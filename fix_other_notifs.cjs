const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCategory = `status: isAdmin ? 'approved' : 'pending'
        });
      }
      
      setRequestStatus('success');`;

const replaceCategory = `status: isAdmin ? 'approved' : 'pending'
        });

        if (!isAdmin) {
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: 'admin',
            type: 'category_request',
            title: 'নতুন ক্যাটাগরি রিকোয়েস্ট',
            body: \`\${newCatTitle} - \${newCatEnglish}\`,
            read: false,
            createdAt: new Date().toISOString(),
            link: 'requests'
          });
        }
      }
      
      setRequestStatus('success');`;

code = code.replace(targetCategory, replaceCategory);

const targetContact = `await addDoc(collection(db, 'contacts'), payload);
        }
        
        setRequestStatus('success');`;

const replaceContact = `await addDoc(collection(db, 'contacts'), payload);

          if (!isAdmin) {
            await addDoc(collection(db, 'notifications'), {
              receiverPhone: 'admin',
              type: 'contact_request',
              title: 'নতুন নাম্বার রিকোয়েস্ট',
              body: \`\${newName} - \${newPhone}\`,
              read: false,
              createdAt: new Date().toISOString(),
              link: 'requests'
            });
          }
        }
        
        setRequestStatus('success');`;

code = code.replace(targetContact, replaceContact);

fs.writeFileSync('src/App.tsx', code);
