const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importRegex = /import\s+\{\s*([\s\S]*?)\}\s+from\s+'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
  const existingIcons = p1.split(',').map(i => i.trim()).filter(Boolean);
  const newIcons = [
    'Activity', 'Pill', 'UserCheck', 'Home', 'School', 'Baby', 'BookOpen', 'Train', 'Car',
    'CarTaxiFront', 'Truck', 'Tv', 'Hammer', 'Scale', 'Utensils', 'Wifi', 'ShoppingCart',
    'Smartphone', 'HeartHandshake', 'MoonStar', 'Microscope', 'Monitor'
  ];
  const allIcons = Array.from(new Set([...existingIcons, ...newIcons]));
  return `import { ${allIcons.join(', ')} } from 'lucide-react';`;
});

const subCatGridRegex = /const IconComponent = selectedCategory\?\.iconName \? \(iconMap\[selectedCategory\.iconName\] \|\| Building2\) : Building2;/;

const subCatIconLogic = `let IconComponent = selectedCategory?.iconName ? (iconMap[selectedCategory.iconName] || Building2) : Building2;
               
               if (subCat === 'হাসপাতাল/ক্লিনিক') IconComponent = Activity;
               else if (subCat === 'ডাক্তার') IconComponent = Stethoscope;
               else if (subCat === 'ডায়াগনস্টিক সেন্টার') IconComponent = Microscope;
               else if (subCat === 'ফার্মেসি') IconComponent = Pill;
               else if (subCat === 'সংসদ সদস্য (এমপি)') IconComponent = UserCheck;
               else if (subCat === 'উপজেলা পরিষদ') IconComponent = Landmark;
               else if (subCat === 'ইউনিয়ন পরিষদ') IconComponent = Home;
               else if (subCat === 'স্কুল/কলেজ/মাদ্রাসা') IconComponent = School;
               else if (subCat === 'কিন্ডারগার্টেন') IconComponent = Baby;
               else if (subCat === 'প্রাইভেট টিউটর') IconComponent = BookOpen;
               else if (subCat === 'বাস') IconComponent = Bus;
               else if (subCat === 'ট্রেন') IconComponent = Train;
               else if (subCat === 'রেন্ট-এ-কার') IconComponent = Car;
               else if (subCat === 'সিএনজি/অটো স্ট্যান্ড') IconComponent = CarTaxiFront;
               else if (subCat === 'ট্রাক/পিকআপ') IconComponent = Truck;
               else if (subCat === 'ইলেকট্রিশিয়ান') IconComponent = Zap;
               else if (subCat === 'প্লাম্বার') IconComponent = Droplets;
               else if (subCat === 'টিভি/ফ্রিজ মেকানিক') IconComponent = Tv;
               else if (subCat === 'রাজমিস্ত্রি/কাঠমিস্ত্রি') IconComponent = Hammer;
               else if (subCat === 'আইনজীবী') IconComponent = Scale;
               else if (subCat === 'গ্যাস সিলিন্ডার') IconComponent = Flame;
               else if (subCat === 'রেস্টুরেন্ট/খাবার দোকান') IconComponent = Utensils;
               else if (subCat === 'কম্পিউটার/ইন্টারনেট/ওয়াইফাই') IconComponent = Wifi;
               else if (subCat === 'হার্ডওয়্যার/ডেকোরেটর') IconComponent = Wrench;
               else if (subCat === 'মুদি দোকান/সুপার শপ') IconComponent = ShoppingCart;
               else if (subCat === 'ব্যাংক') IconComponent = Landmark;
               else if (subCat === 'এনজিও') IconComponent = Users;
               else if (subCat === 'মোবাইল ব্যাংকিং এজেন্ট') IconComponent = Smartphone;
               else if (subCat === 'কাজী অফিস') IconComponent = HeartHandshake;
               else if (subCat === 'মসজিদ/মন্দির') IconComponent = MoonStar;
               else if (subCat === 'স্বেচ্ছাসেবী সংগঠন') IconComponent = Heart;
               else if (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'].includes(subCat)) IconComponent = Droplets;
`;
code = code.replace(subCatGridRegex, subCatIconLogic);

fs.writeFileSync('src/App.tsx', code);
