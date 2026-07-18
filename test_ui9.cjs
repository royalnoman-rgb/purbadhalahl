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
    const buttons = Array.from(document.querySelectorAll('button'));
    // click 'উপজেলায় কর্মরত সাংবাদিকবৃন্দ' which should have 26 numbers
    let btn = buttons.find(b => b.innerText.includes('সাংবাদিকবৃন্দ'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 3000));

  const content = await page.evaluate(() => {
    const contacts = Array.from(document.querySelectorAll('.bg-white.p-4.rounded-2xl'));
    return contacts.map(c => c.querySelector('h3') ? c.querySelector('h3').innerText : '');
  });
  
  console.log("Contacts:", content.filter(Boolean));
  
  await browser.close();
})();
