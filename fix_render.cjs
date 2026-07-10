const fs = require('fs');

function fixApp() {
  let code = fs.readFileSync('src/App.tsx', 'utf8');
  const target = `  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">`;
  const replace = `  return (
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">`;
  
  code = code.replace(target, replace);
  fs.writeFileSync('src/App.tsx', code);
}

function fixCommunity() {
  let code = fs.readFileSync('src/Community.tsx', 'utf8');
  const target = `}

  return (
    <div className="mt-4">`;
  const replace = `}

  return (
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
    <div className="mt-4">`;
  
  code = code.replace(target, replace);
  fs.writeFileSync('src/Community.tsx', code);
}

fixApp();
fixCommunity();
