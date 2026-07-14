const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

content = content.replace(
  'manualChunks: undefined',
  `manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/messaging'],
            icons: ['lucide-react']
          }`
);

fs.writeFileSync('vite.config.ts', content);
console.log("vite config patched");
