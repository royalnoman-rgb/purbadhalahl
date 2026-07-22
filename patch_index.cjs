const fs = require('fs');
let code = fs.readFileSync('src/index.tsx', 'utf8');

const targetImport = `import { BrowserRouter, Routes, Route } from 'react-router-dom';`;
const replImport = `import { BrowserRouter, Routes, Route } from 'react-router-dom';\nimport { HelmetProvider } from 'react-helmet-async';`;

const targetRender = `<BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>`;
    
const replRender = `<HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/category/:categoryId" element={<App />} />
          <Route path="/category/:categoryId/:subCategory" element={<App />} />
          <Route path="/community" element={<App />} />
          <Route path="/map" element={<App />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>`;

code = code.replace(targetImport, replImport);
code = code.replace(targetRender, replRender);

fs.writeFileSync('src/index.tsx', code);
console.log('Successfully patched index.tsx');
