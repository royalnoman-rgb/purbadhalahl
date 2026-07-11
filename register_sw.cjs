const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `<script type="module" src="/src/index.tsx"></script>`;
const replace = `<script type="module" src="/src/index.tsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('SW registration failed: ', error);
          });
        });
      }
    </script>`;

code = code.replace(target, replace);
fs.writeFileSync('index.html', code);
