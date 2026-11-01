const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3001');
  await page.screenshot({ path: '../halaman login/screenshot-implementation.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved successfully.');
})();
