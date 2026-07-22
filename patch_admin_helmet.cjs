const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const targetImport = `import { useState, useEffect } from 'react';`;
const replImport = `import { useState, useEffect } from 'react';\nimport { Helmet } from 'react-helmet-async';`;

const targetDiv = `<div className="min-h-screen bg-slate-50 font-sans text-slate-800">`;
const replDiv = `<div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Helmet>
        <title>Admin Dashboard | পূর্বধলা স্মার্ট হেল্পলাইন</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>`;

if (code.includes(targetImport)) {
  code = code.replace(targetImport, replImport);
}
if (code.includes(targetDiv)) {
  code = code.replace(targetDiv, replDiv);
}

fs.writeFileSync('src/Admin.tsx', code);
console.log("Admin Helmet added");
