import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf8');

if (!content.includes('Noto Sans Bengali')) {
  let newContent = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');\n` + content;
  newContent += `\n@theme {\n  --font-sans: "Noto Sans Bengali", ui-sans-serif, system-ui, sans-serif;\n}\n`;
  fs.writeFileSync('src/index.css', newContent);
  console.log("Updated index.css with Noto Sans Bengali");
}
