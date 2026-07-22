const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">`;
const repl = `<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <Helmet>
        <title>
          {selectedCategory ? \`\${selectedSubCategory ? selectedSubCategory + ' - ' : ''}\${selectedCategory.title} | পূর্বধলা স্মার্ট হেল্পলাইন\` : 'পূর্বধলা স্মার্ট হেল্পলাইন'}
        </title>
        <meta name="description" content={selectedCategory ? \`\${selectedCategory.title} এর প্রয়োজনীয় সকল নাম্বার ও তথ্য খুঁজুন।\` : 'পূর্বধলার সকল জরুরি ও প্রয়োজনীয় নাম্বার, ডাক্তার, হাসপাতাল, রক্তদাতা এবং আরও অনেক কিছু একসাথে।'} />
        <meta property="og:title" content={selectedCategory ? \`\${selectedSubCategory ? selectedSubCategory + ' - ' : ''}\${selectedCategory.title} | পূর্বধলা স্মার্ট হেল্পলাইন\` : 'পূর্বধলা স্মার্ট হেল্পলাইন'} />
        <meta property="og:description" content={selectedCategory ? \`\${selectedCategory.title} এর প্রয়োজনীয় সকল নাম্বার ও তথ্য খুঁজুন।\` : 'পূর্বধলার সকল জরুরি ও প্রয়োজনীয় নাম্বার, ডাক্তার, হাসপাতাল, রক্তদাতা এবং আরও অনেক কিছু একসাথে।'} />
      </Helmet>`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
console.log("Helmet added");
