const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let errors = [];
  page.on('pageerror', err => {
    errors.push(err.toString());
  });
  
  await page.goto('http://localhost:3002', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons`);
  for (let i = 0; i < buttons.length; i++) {
    try {
      await buttons[i].click();
      await new Promise(r => setTimeout(r, 500));
    } catch(e) {}
  }
  
  if (errors.length > 0) {
    console.log("ERRORS:", errors.join('\n'));
  } else {
    console.log("No errors.");
  }
  
  await browser.close();
})();
