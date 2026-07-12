const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.evaluate(() => document.querySelector('#root').innerHTML);
  console.log(html.substring(0, 1000));
  await browser.close();
})();
