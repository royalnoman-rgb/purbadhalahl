const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetContact = `await updateDoc(contributorRef, {
            approvedCount: increment(1),
            points: increment(10)
          });
        } else {
          await setDoc(contributorRef, {
            name: contactData.contributorName,
            phone: contactData.contributorPhone,
            facebookUrl: contactData.contributorFacebook || '',
            approvedCount: 1,
            points: 10
          });
        }`;

const replaceContact = `await updateDoc(contributorRef, {
            approvedCount: increment(1),
            points: increment(10)
          });
        } else {
          await setDoc(contributorRef, {
            name: contactData.contributorName,
            phone: contactData.contributorPhone,
            facebookUrl: contactData.contributorFacebook || '',
            approvedCount: 1,
            points: 10
          });
        }

        // Notify user
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: contactData.contributorPhone,
          type: 'contact_approved',
          title: 'আপনার নাম্বার এপ্রুভ হয়েছে!',
          body: \`\${contactData.name} নাম্বারটি এপ্রুভ করা হয়েছে এবং আপনি 10 পয়েন্ট পেয়েছেন।\`,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'stats'
        });`;

code = code.replace(targetContact, replaceContact);

const targetCategory = `await updateDoc(contributorRef, {
            approvedCount: increment(1),
            points: increment(20)
          });
        } else {
          await setDoc(contributorRef, {
            name: categoryData.contributorName,
            phone: categoryData.contributorPhone,
            facebookUrl: categoryData.contributorFacebook || '',
            approvedCount: 1,
            points: 20
          });
        }`;

const replaceCategory = `await updateDoc(contributorRef, {
            approvedCount: increment(1),
            points: increment(20)
          });
        } else {
          await setDoc(contributorRef, {
            name: categoryData.contributorName,
            phone: categoryData.contributorPhone,
            facebookUrl: categoryData.contributorFacebook || '',
            approvedCount: 1,
            points: 20
          });
        }

        // Notify user
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: categoryData.contributorPhone,
          type: 'category_approved',
          title: 'আপনার ক্যাটাগরি এপ্রুভ হয়েছে!',
          body: \`\${categoryData.title} ক্যাটাগরিটি এপ্রুভ করা হয়েছে এবং আপনি 20 পয়েন্ট পেয়েছেন।\`,
          read: false,
          createdAt: new Date().toISOString(),
          link: 'stats'
        });`;

code = code.replace(targetCategory, replaceCategory);

fs.writeFileSync('src/Admin.tsx', code);
