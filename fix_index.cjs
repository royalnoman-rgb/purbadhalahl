const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  '<link rel="icon" type="image/png" href="/logo.png" />',
  '<link rel="icon" type="image/png" href="/logo.png" />\\n    <link rel="manifest" href="/manifest.json" />\\n    <meta name="theme-color" content="#059669" />\\n    <link rel="apple-touch-icon" href="/logo.png" />'
);

fs.writeFileSync('index.html', code);
