const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `               // Get icon from category if available, else fallback
               const IconComponent = selectedCategory?.iconName ? require('lucide-react')[selectedCategory.iconName] || require('lucide-react').Grid : require('lucide-react').Grid;`;

const replaceStr = `               // Get icon from category if available, else fallback
               const IconComponent = selectedCategory?.iconName ? (iconMap[selectedCategory.iconName] || iconMap.Grid || Building2) : (iconMap.Grid || Building2);`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/App.tsx', code);
