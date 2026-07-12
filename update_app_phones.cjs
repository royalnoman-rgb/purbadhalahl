const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { toBengaliDigits, toEnglishDigits }")) {
  code = code.replace("import { Category", "import { toBengaliDigits, toEnglishDigits } from './utils';\nimport { Category");
}

code = code.replace(
`  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    val = val.replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w).toString());
    setNewPhone(val);
  };`,
`  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhone(toEnglishDigits(e.target.value));
  };`
);

// value={newPhone} -> value={toBengaliDigits(newPhone)}
code = code.replace(
  `type="tel" required value={newPhone} onChange={handlePhoneChange}`,
  `type="tel" required value={toBengaliDigits(newPhone)} onChange={handlePhoneChange}`
);

// value={loginPhone}
code = code.replace(
  `type="tel" required value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)}`,
  `type="tel" required value={toBengaliDigits(loginPhone)} onChange={(e) => setLoginPhone(toEnglishDigits(e.target.value))}`
);
code = code.replace(
  `type="tel" required value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)}`,
  `type="tel" required value={toBengaliDigits(loginPhone)} onChange={(e) => setLoginPhone(toEnglishDigits(e.target.value))}`
);

// value={contributorPhone}
code = code.replace(
  `type="tel" required value={contributorPhone} onChange={(e) => setContributorPhone(e.target.value)}`,
  `type="tel" required value={toBengaliDigits(contributorPhone)} onChange={(e) => setContributorPhone(toEnglishDigits(e.target.value))}`
);

// Also update phone displays in App.tsx
// contact.phone
code = code.replaceAll(`{contact.phone}`, `{toBengaliDigits(contact.phone)}`);
// user.phone (except inside href or admin check)
code = code.replaceAll(`{user.phone}`, `{toBengaliDigits(user.phone)}`);
code = code.replaceAll(`{selectedUserProfile}`, `{toBengaliDigits(selectedUserProfile)}`);

// Restore inside href correctly
code = code.replaceAll(`href={\`tel:\${toBengaliDigits(contact.phone)}\`}`, `href={\`tel:\${contact.phone}\`}`);
code = code.replaceAll(`href={\`https://wa.me/\${toBengaliDigits(contact.phone).replace(/[^0-9+]/g, '')}\`}`, `href={\`https://wa.me/\${contact.phone.replace(/[^0-9+]/g, '')}\`}`);

fs.writeFileSync('src/App.tsx', code);
