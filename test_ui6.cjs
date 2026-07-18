const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 3000));
  
  await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    let btn = buttons.find(b => b.innerText.includes('সাংবাদিক ও সাংবাদিক সংগঠন'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
    const subs = Array.from(document.querySelectorAll('.flex-nowrap button'));
    // click 'উপজেলায় কর্মরত সাংবাদিকবৃন্দ'
    let sub = subs.find(s => s.innerText.includes('সাংবাদিকবৃন্দ'));
    if (sub) sub.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  const content = await page.evaluate(() => {
    // get all h3 elements which usually hold names
    const h3s = Array.from(document.querySelectorAll('h3'));
    return h3s.map(h => h.innerText);
  });
  
  console.log("Names:", content);
  
  await browser.close();
})();
