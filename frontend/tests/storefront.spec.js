import { test, expect } from '@playwright/test';

test('catalogue, wishlist and cart remain usable after a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bedsheets, Towels, Pillows & Beds. Woven with Madurai Quality.' })).toBeVisible();
  await page.getByRole('button', { name: 'Save Madurai Traditional Floral Double Bedsheet to wishlist' }).click();
  await page.getByRole('link', { name: 'View Madurai Traditional Floral Double Bedsheet' }).click();
  await expect(page).toHaveURL(/products\/1\/madurai-traditional-floral-double-bedsheet/);
  await page.locator('.saree-actions').getByRole('button', { name: 'ADD TO BAG', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Shopping bag, 1 items' }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Madurai Traditional Floral Double Bedsheet' })).toBeVisible();
  await page.getByRole('button', { name: 'Increase Madurai Traditional Floral Double Bedsheet quantity' }).click();
  await expect(page.getByRole('dialog').getByText('₹1,780').first()).toBeVisible();
  await page.getByRole('button', { name: 'Remove Madurai Traditional Floral Double Bedsheet from bag' }).click();
  await expect(page.getByRole('heading', { name: 'Your shopping bag is empty.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('search gives a clear empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search textiles' }).click();
  await page.getByRole('textbox', { name: 'Search catalogue' }).fill('no-matching-fabric-xyz');
  await expect(page.getByRole('heading', { name: 'No matches found.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Madurai Traditional Floral Double Bedsheet' })).toBeVisible();
});

test('search suggestions lead to a product, and bag removal can be undone', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search textiles' }).click();
  await page.getByRole('textbox', { name: 'Search catalogue' }).fill('waffle');
  const searchDialog = page.getByRole('dialog');
  await expect(searchDialog.getByText('1 match for “waffle”')).toBeVisible();
  await searchDialog.getByRole('link').filter({ hasText: 'Madurai Pure Cotton Waffle Bath Towel' }).click();
  await expect(page).toHaveURL(/products\/4\/madurai-pure-cotton-waffle-bath-towel-pack-of-2/);
  await page.locator('.saree-actions').getByRole('button', { name: 'ADD TO BAG', exact: true }).click();
  await page.getByRole('button', { name: 'View bag', exact: true }).click();
  await page.getByRole('button', { name: 'Remove Madurai Pure Cotton Waffle Bath Towel (Pack of 2) from bag' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Madurai Pure Cotton Waffle Bath Towel (Pack of 2)' })).toBeVisible();
});

test('mock checkout and newsletter succeed without requesting an API', async ({ page }) => {
  const apiRequests = [];
  await page.route('**/api/**', route => { apiRequests.push(route.request().url()); return route.abort(); });
  await page.goto('/products/1/madurai-traditional-floral-double-bedsheet');
  await page.locator('.saree-actions').getByRole('button', { name: 'ADD TO BAG', exact: true }).click();
  await page.getByRole('button', { name: 'View bag', exact: true }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
  const checkout = page.getByRole('dialog');
  await checkout.getByLabel('Full name').fill('Demo Customer');
  await checkout.getByLabel('Email address', { exact: true }).fill('demo@example.com');
  await checkout.getByLabel('Phone number').fill('9876543210');
  await checkout.getByLabel('Delivery address').fill('123 Sample Street');
  await checkout.getByLabel('City', { exact: true }).fill('Tiruchirappalli');
  await checkout.getByLabel('PIN code').fill('620001');
  await checkout.getByRole('button', { name: 'PLACE ORDER' }).click();
  await expect(checkout.getByRole('heading', { name: 'Your demo order is confirmed.' })).toBeVisible();
  await expect(checkout.getByText('Total: ₹989')).toBeVisible(); // 890 + 99 shipping
  const receipt = await page.evaluate(() => JSON.parse(localStorage.getItem('rt-last-demo-order')));
  expect(receipt.total).toBe(989);
  expect(receipt.customer).toBeUndefined();
  await checkout.getByRole('button', { name: 'CONTINUE EXPLORING' }).click();
  await page.getByLabel('Your email address', { exact: true }).fill('demo@example.com');
  await page.getByRole('button', { name: 'Subscribe to newsletter' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo signup complete. Welcome to Rajamani Textiles updates!' })).toBeVisible();
  expect(apiRequests).toEqual([]);
});
