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

  // --- CONVERSATION 1: Products, Stock & Add to Bag ---
  {
    console.log('\n--- Capturing Conversation 1: Products, Stock & Add to Bag ---');
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

    // Click chat launcher button
    await page.click('.wa-chatbot-btn');
    await page.waitForSelector('.wa-chat-window');
    await page.waitForTimeout(400);

    // Type Question 1: "is the waffle towel available"
    const input = page.locator('.wa-input-footer input');
    await input.fill('is the waffle towel available');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Type Question 2: "double bedsheet price"
    await input.fill('double bedsheet price');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Click "Add to Bag" on the first visible product card in chat
    const addBtn = page.locator('.wa-card-add-btn').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }

    const shot1Path = join(artifactsDir, 'chat-conversation-1-products.png');
    await page.screenshot({ path: shot1Path });
    console.log('Saved Conversation 1 screenshot:', shot1Path);
    await context.close();
  }

  // --- CONVERSATION 2: Returns, Innerwear Exclusion & Delivery ---
  {
    console.log('\n--- Capturing Conversation 2: Returns, Innerwear & Shipping Charges ---');
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

    await page.click('.wa-chatbot-btn');
    await page.waitForSelector('.wa-chat-window');
    await page.waitForTimeout(400);

    const input = page.locator('.wa-input-footer input');
    // Question 1: Innerwear return
    await input.fill('can I return innerwear?');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Question 2: General return
    await input.fill('what is the return policy for bedsheets');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Question 3: Shipping charges (Must not state amount)
    await input.fill('what are the shipping charges?');
    await input.press('Enter');
    await page.waitForTimeout(900);

    const shot2Path = join(artifactsDir, 'chat-conversation-2-returns-delivery.png');
    await page.screenshot({ path: shot2Path });
    console.log('Saved Conversation 2 screenshot:', shot2Path);
    await context.close();
  }

  // --- CONVERSATION 3: Diwali Festival, Timings & Wholesale ---
  {
    console.log('\n--- Capturing Conversation 3: Diwali, Shop Timings & Wholesale ---');
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

    await page.click('.wa-chatbot-btn');
    await page.waitForSelector('.wa-chat-window');
    await page.waitForTimeout(400);

    const input = page.locator('.wa-input-footer input');
    // Question 1: Diwali festival open
    await input.fill('is the shop open on diwali?');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Question 2: Regular shop timings
    await input.fill('what are your regular opening hours?');
    await input.press('Enter');
    await page.waitForTimeout(900);

    // Question 3: Wholesale inquiry
    await input.fill('wholesale rate for cotton bedsheets');
    await input.press('Enter');
    await page.waitForTimeout(900);

    const shot3Path = join(artifactsDir, 'chat-conversation-3-diwali-wholesale.png');
    await page.screenshot({ path: shot3Path });
    console.log('Saved Conversation 3 screenshot:', shot3Path);
    await context.close();
  }

  await browser.close();
  console.log('All 3 conversation screenshots captured successfully.');
}

run().catch(err => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
