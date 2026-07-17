const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });
  
  await page.goto('http://localhost:3002', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
    // find 'লগইন' button
    const buttons = Array.from(document.querySelectorAll('button'));
    let loginBtn = buttons.find(b => b.innerText.includes('লগইন'));
    if (loginBtn) loginBtn.click();
    
    await new Promise(r => setTimeout(r, 1000));
    
    // find 'পাসওয়ার্ড ভুলে গেছেন?' button
    const forgotBtns = Array.from(document.querySelectorAll('button'));
    let forgotBtn = forgotBtns.find(b => b.innerText.includes('পাসওয়ার্ড ভুলে গেছেন?'));
    if (forgotBtn) forgotBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(async () => {
    // Admin phone is admin, which always exists in db probably? No, let's use "admin"
    const input = document.querySelector('input[placeholder="মোবাইল বা ইমেইল"]');
    if (input) {
      input.value = "admin";
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // click reset password button
    const resetBtns = Array.from(document.querySelectorAll('button'));
    let resetBtn = resetBtns.find(b => b.innerText.includes('কোড পাঠান'));
    if (resetBtn) resetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  if (errors.length > 0) {
    console.log("ERRORS:", errors.join('\n'));
  } else {
    console.log("No errors.");
  }
  
  await browser.close();
})();
