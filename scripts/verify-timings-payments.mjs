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

  console.log('Testing updated shop timings & payment methods in chat...');
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  // Open chat
  await page.click('.wa-chatbot-btn');
  await page.waitForSelector('.wa-chat-window');
  await page.waitForTimeout(400);

  const input = page.locator('.wa-input-footer input');

  // Question 1: Timings
  await input.fill('what are your shop timings?');
  await input.press('Enter');
  await page.waitForTimeout(800);

  // Question 2: Payments
  await input.fill('do you accept Google Pay, Cards and Cash?');
  await input.press('Enter');
  await page.waitForTimeout(800);

  // Screenshot
  const shotPath = join(artifactsDir, 'chat-conversation-4-timings-payments.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot to:', shotPath);

  // Check last messages in DOM
  const texts = await page.$$eval('.wa-bubble p.wa-text', els => els.map(e => e.innerText));
  console.log('\n--- VERIFIED BOT REPLIES ---');
  console.log('Timings reply:', texts.find(t => t.includes('8 AM - 9:30 PM')));
  console.log('Payment reply:', texts.find(t => t.includes('UPI') && t.includes('Cards')));

  await browser.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
