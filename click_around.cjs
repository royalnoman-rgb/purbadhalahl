const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let dupes = [];
  page.on('console', msg => {
    if (msg.text().includes('Encountered two children with the same key')) {
      dupes.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // click daily_services category
  await page.evaluate(() => {
    const cats = Array.from(document.querySelectorAll('h3'));
    const cat = cats.find(h => h.textContent.includes('দৈনন্দিন সেবা'));
    if (cat) cat.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  if (dupes.length > 0) {
    console.log("Found duplicate key errors:");
    dupes.forEach(d => console.log(d));
  } else {
    console.log("No duplicate key errors found after click.");
  }
  
  await browser.close();
})();
