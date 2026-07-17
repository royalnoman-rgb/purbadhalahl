const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('</body>', `
  <div id="error-log" style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;z-index:9999;max-height:200px;overflow:auto;padding:10px;display:none;"></div>
  <script>
    window.addEventListener('error', (e) => {
      const err = document.getElementById('error-log');
      err.style.display = 'block';
      err.innerText += '\\n' + (e.error ? e.error.stack : e.message);
    });
  </script>
</body>`);
fs.writeFileSync('index.html', content);
