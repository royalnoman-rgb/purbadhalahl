const fs = require('fs');
const babel = require('@babel/core');

const code = fs.readFileSync('src/App.tsx', 'utf8');
try {
  babel.parseSync(code, {
    filename: 'App.tsx',
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
  });
  console.log("No syntax errors found by Babel!");
} catch (e) {
  console.error("Syntax Error at: ", e.loc);
  console.error(e.message);
}
