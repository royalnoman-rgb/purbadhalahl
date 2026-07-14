const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variables
content = content.replace(
  `  const [newBloodGroup, setNewBloodGroup] = useState('');`,
  `  const [newBloodGroup, setNewBloodGroup] = useState('');
  const [newBloodDonorGender, setNewBloodDonorGender] = useState('male');
  const [newLastDonationDate, setNewLastDonationDate] = useState('');`
);

// 2. Add to handleSuggestEdit
content = content.replace(
  `    setNewBloodGroup(contact.categoryId === 'blood_donors' ? (contact.subCategory || '') : '');`,
  `    setNewBloodGroup(contact.categoryId === 'blood_donors' ? (contact.subCategory || '') : '');
    setNewBloodDonorGender(contact.gender || 'male');
    setNewLastDonationDate(contact.lastDonationDate || '');`
);

// 3. Add to openNewRequestModal
content = content.replace(
  `    setNewBloodGroup('');`,
  `    setNewBloodGroup('');
    setNewBloodDonorGender('male');
    setNewLastDonationDate('');`
);

// 4. Update handleRequestSubmit payload
content = content.replace(
  `      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
        categoryId: newCategory,
        status: isAdmin ? 'approved' : 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };`,
  `      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
        categoryId: newCategory,
        status: isAdmin ? 'approved' : 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };
      
      if (newCategory === 'blood_donors' && newBloodGroup !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন') {
        payload.gender = newBloodDonorGender;
        payload.lastDonationDate = newLastDonationDate || null;
      }`
);

// Also need to update the payload inside if (editingContactId) -> if (isAdmin) branch
content = content.replace(
  `          // If admin, direct update
          await setDoc(doc(db, 'contacts', editingContactId), {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
            subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
          }, { merge: true });`,
  `          // If admin, direct update
          const updatePayload: any = {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
            subCategory: newCategory === 'blood_donors' ? newBloodGroup : newSubCategory,
          };
          if (newCategory === 'blood_donors' && newBloodGroup !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন') {
            updatePayload.gender = newBloodDonorGender;
            updatePayload.lastDonationDate = newLastDonationDate || null;
          }
          await setDoc(doc(db, 'contacts', editingContactId), updatePayload, { merge: true });`
);

// 5. Update reset in handleRequestSubmit
content = content.replace(
  `        setNewBloodGroup('');
        setEditingContactId(null);`,
  `        setNewBloodGroup('');
        setNewBloodDonorGender('male');
        setNewLastDonationDate('');
        setEditingContactId(null);`
);

// 6. Update the form
const formTarget = `{newCategory === 'blood_donors' ? (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ ও ধরন *</label>
    <select required value={newBloodGroup} onChange={(e) => setNewBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
      <option value="" disabled>নির্বাচন করুন</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন">স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন</option>
    </select>
  </div>
) : (`;

const formReplacement = `{newCategory === 'blood_donors' ? (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ ও ধরন *</label>
      <select required value={newBloodGroup} onChange={(e) => setNewBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
        <option value="" disabled>নির্বাচন করুন</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন">স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন</option>
      </select>
    </div>
    {newBloodGroup && newBloodGroup !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন' && (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্গ * (রক্তদানের যোগ্যতার জন্য)</label>
          <select required value={newBloodDonorGender} onChange={(e) => setNewBloodDonorGender(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
            <option value="male">পুরুষ</option>
            <option value="female">নারী</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">সর্বশেষ রক্তদানের তারিখ (যদি দিয়ে থাকেন)</label>
          <input type="date" value={newLastDonationDate} onChange={(e) => setNewLastDonationDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white" />
          <p className="text-xs text-gray-500 mt-1">
            * বিশ্ব স্বাস্থ্য সংস্থার মতে, পুরুষরা ৩ মাস পর পর এবং নারীরা ৪ মাস পর পর রক্ত দিতে পারবেন।
          </p>
        </div>
      </>
    )}
  </div>
) : (`;

content = content.replace(formTarget, formReplacement);

// 7. Render badge and eligibility on the contact item
const contactCardTarget = `                          <h3 className="font-semibold text-gray-900 text-[14px] sm:text-[15px] truncate">{contact.name}</h3>`;

const contactCardReplacement = `                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-[14px] sm:text-[15px] truncate">{contact.name}</h3>
                            {contact.categoryId === 'blood_donors' && contact.subCategory !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন' && (
                              <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                                রক্তদাতা
                              </span>
                            )}
                          </div>`;

content = content.replace(contactCardTarget, contactCardReplacement);

const contactCardDetailsTarget = `                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5">
                          {contact.details && (
                            <p className="text-[12px] sm:text-[13px] text-gray-600 truncate">{contact.details}</p>
                          )}`;

const contactCardDetailsReplacement = `                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5">
                          {contact.categoryId === 'blood_donors' && contact.subCategory !== 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন' && (
                            <div className="mt-0.5">
                              {(() => {
                                if (!contact.lastDonationDate) {
                                  return <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">রক্ত দানে প্রস্তুত</span>;
                                }
                                const lastDate = new Date(contact.lastDonationDate);
                                const today = new Date();
                                const diffTime = Math.abs(today.getTime() - lastDate.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const requiredDays = contact.gender === 'female' ? 120 : 90;
                                const isEligible = diffDays >= requiredDays;
                                
                                return (
                                  <span className={\`text-[11px] font-medium px-1.5 py-0.5 rounded border \${isEligible ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}\`}>
                                    {isEligible ? 'রক্ত দানে প্রস্তুত' : 'রক্ত দানের সময় হয়নি'} 
                                    <span className="text-gray-500 ml-1 font-normal">
                                      ({contact.lastDonationDate.split('-').reverse().join('/')})
                                    </span>
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          {contact.details && (
                            <p className="text-[12px] sm:text-[13px] text-gray-600 truncate">{contact.details}</p>
                          )}`;

content = content.replace(contactCardDetailsTarget, contactCardDetailsReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with blood donor features");
