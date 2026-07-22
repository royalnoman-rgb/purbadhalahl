const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `import { Link } from 'react-router-dom';`;
const replImport = `import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';\nimport { Helmet } from 'react-helmet-async';`;

if(code.includes(targetImport)) {
  code = code.replace(targetImport, replImport);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Imports updated");
} else {
  console.log("Failed to find target import");
}
