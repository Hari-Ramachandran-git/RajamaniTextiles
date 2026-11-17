import { chromium } from '../frontend/node_modules/@playwright/test/index.mjs';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const artifactsDir = 'C:\\Users\\harit\\.gemini\\antigravity\\brain\\7f58b55d-5c59-49a8-a403-397af742aaee';
if (!existsSync(artifactsDir)) mkdirSync(artifactsDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('Navigating to http://127.0.0.1:4173/ ...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  // Scroll to Shop By Category
  const categoryGrid = page.locator('.category-showcase-grid');
  await categoryGrid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Check category images
  const categoryCards = await page.$$eval('.category-browse-card', cards => {
    return cards.map(c => {
      const img = c.querySelector('img');
      const title = c.querySelector('h3')?.innerText;
      return {
        title,
        src: img?.getAttribute('src'),
        alt: img?.getAttribute('alt'),
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight,
        complete: img?.complete
      };
    });
  });

  console.log('\n=== CATEGORY CARDS INSPECTION ===');
  console.table(categoryCards);

  // Take screenshot of Category Grid
  const categoryScreenshotPath = join(artifactsDir, 'category-showcase-grid.png');
  await page.screenshot({ path: categoryScreenshotPath });
  console.log('Saved category grid screenshot to:', categoryScreenshotPath);

  // Navigate to /products
  console.log('\nNavigating to http://127.0.0.1:4173/products ...');
  await page.goto('http://127.0.0.1:4173/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const productScreenshotPath = join(artifactsDir, 'products-page.png');
  await page.screenshot({ path: productScreenshotPath });
  console.log('Saved products page screenshot to:', productScreenshotPath);

  console.log('\n=== CONSOLE ERRORS ===');
  console.log(consoleErrors.length > 0 ? consoleErrors : 'Zero console errors!');

  console.log('\n=== FAILED REQUESTS ===');
  console.log(failedRequests.length > 0 ? failedRequests : 'Zero failed requests!');

  await browser.close();
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
