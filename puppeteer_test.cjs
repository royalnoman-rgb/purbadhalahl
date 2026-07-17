const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let errors = [];
  page.on('pageerror', err => {
    errors.push(err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('Console error: ' + msg.text());
    }
  });
  
  await page.goto('http://localhost:3002', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  
  if (errors.length > 0) {
    console.log("ERRORS:", errors.join('\n'));
  } else {
    console.log("No errors on load.");
  }
  
  await browser.close();
})();
