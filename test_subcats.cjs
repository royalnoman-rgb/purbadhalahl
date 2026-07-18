const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    let btn = buttons.find(b => b.innerText.includes('প্রশাসন ও সরকারি অফিস'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.evaluate(() => {
    const subs = Array.from(document.querySelectorAll('.flex-nowrap button'));
    return subs.map(s => s.innerText);
  });
  
  console.log("Subcategories in UI:", content);
  
  await browser.close();
})();
