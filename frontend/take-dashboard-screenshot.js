const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/dashboard');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '../dashboard/screenshot-implementation.png', fullPage: true });
  await browser.close();
  console.log('Dashboard screenshot saved successfully.');
})();
