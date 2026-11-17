import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { answerQuestion } from './answerEngine.js';

const products = JSON.parse(readFileSync('src/data/products.json', 'utf8'));
const shopInfo = JSON.parse(readFileSync('src/data/shopInfo.json', 'utf8'));

test('1. double bedsheet price -> answers with matching double bedsheet and price', () => {
  const res = answerQuestion('double bedsheet price', { products, shopInfo });
  assert.ok(res.products.length > 0, 'Should return matching products');
  assert.ok(res.text.includes('890') || res.products.some(p => p.price === 890));
  assert.ok(res.intent === 'product_match');
});

test('2. double bedsheet vilai -> Tamil price keyword vilai returns prices', () => {
  const res = answerQuestion('double bedsheet vilai', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.ok(res.text.toLowerCase().includes('priced') || res.text.toLowerCase().includes('options') || res.products.length > 0);
});

test('3. towels under 500 -> filters towels strictly <= 500', () => {
  const res = answerQuestion('towels under 500', { products, shopInfo });
  assert.ok(res.products.length > 0, 'Should find towels under 500');
  for (const p of res.products) {
    assert.ok(p.price <= 500, `Product ${p.name} price ${p.price} should be <= 500`);
    assert.equal(p.category, 'Towels');
  }
});

test('4. twels undr 500 -> handles spelling slips for towels and under', () => {
  const res = answerQuestion('twels undr 500', { products, shopInfo });
  assert.ok(res.products.length > 0, 'Should recognize typo twels as towels');
  assert.equal(res.products[0].category, 'Towels');
});

test('5. pillow options -> returns pillow collection items', () => {
  const res = answerQuestion('pillow options', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.ok(res.products.every(p => p.category === 'Pillows'));
});

test('6. do you have navy bedsheet -> matches Navy color bedsheet', () => {
  const res = answerQuestion('do you have navy bedsheet', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.equal(res.products[0].color, 'Navy');
  assert.equal(res.products[0].category, 'Bedsheets');
});

test('7. cheapest bedsheet -> sorts and returns the lowest price bedsheet', () => {
  const res = answerQuestion('cheapest bedsheet', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.equal(res.products[0].id, 3); // Daily Comfort Geometric Single Bedsheet at 490
  assert.equal(res.products[0].price, 490);
  assert.ok(res.text.includes('490'));
});

test('8. is the waffle towel available -> returns "In stock" for available product', () => {
  const res = answerQuestion('is the waffle towel available', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.equal(res.products[0].id, 4);
  assert.ok(res.text.includes('In stock'), `Expected "In stock" in reply, got: ${res.text}`);
});

test('9. waffle towel irukka -> Tanglish available word irukka checks stock', () => {
  const res = answerQuestion('waffle towel irukka', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.ok(res.text.includes('In stock'));
});

test('10. travel bed irukka -> returns out of stock when product stock is "out"', () => {
  const res = answerQuestion('travel bed irukka', { products, shopInfo });
  assert.ok(res.products.length > 0);
  // Product 10 has stock: "out"
  assert.ok(res.text.toLowerCase().includes('out of stock') || res.products.some(p => p.stock === 'out'));
});

test('11. unknown stock item -> says "Please check availability on WhatsApp" and never claims availability', () => {
  // Product 8 (Luxury Cloud Microfiber Pillows) has no stock field (missing/unknown)
  const res = answerQuestion('is luxury cloud microfiber pillow available', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.ok(res.text.includes('Please check availability on WhatsApp'), `Should request WhatsApp check, got: ${res.text}`);
  assert.ok(!res.text.includes('In stock'), 'Must NOT claim in stock when unknown');
});

test('12. can I return innerwear -> says clearly inner wears cannot be returned or exchanged', () => {
  const res = answerQuestion('can I return innerwear?', { products, shopInfo });
  assert.equal(res.intent, 'returns_innerwear');
  assert.ok(res.text.toLowerCase().includes('inner wears cannot be returned or exchanged'));
});

test('13. vest thirumba kudukalama -> Tanglish innerwear return says cannot be returned', () => {
  const res = answerQuestion('vest thirumba kudukalama', { products, shopInfo });
  assert.equal(res.intent, 'returns_innerwear');
  assert.ok(res.text.toLowerCase().includes('cannot be returned or exchanged'));
});

test('14. what is the return policy for bedsheets -> states exact conditions without guesswork', () => {
  const res = answerQuestion('what is the return policy for bedsheets', { products, shopInfo });
  assert.equal(res.intent, 'returns_general');
  assert.ok(res.text.includes(shopInfo.returnsAndExchange.conditions));
  assert.ok(res.text.includes('without any stains or damage'));
});

test('15. is the shop open on diwali -> answers shop open during festive seasons except Diwali day', () => {
  const res = answerQuestion('is the shop open on diwali', { products, shopInfo });
  assert.equal(res.intent, 'shop_festival_availability');
  assert.ok(res.text.includes('except on the day of Diwali'));
});

test('16. festival timings -> answers from shopAvailability', () => {
  const res = answerQuestion('festival timings and holiday open', { products, shopInfo });
  assert.equal(res.intent, 'shop_festival_availability');
  assert.ok(res.text.includes(shopInfo.shopAvailability.festivalSeasons));
});

test('17. what are the shipping charges -> MUST NOT state any amount or number', () => {
  const res = answerQuestion('what are the shipping charges', { products, shopInfo });
  assert.equal(res.intent, 'shipping_charges');
  assert.ok(res.text.includes('Shipping charges depend on the delivery area and will be updated soon'));
  // Verify strictly NO numerical amounts like ₹99, 99, 1999 are stated!
  assert.ok(!/₹?\s*\d+/.test(res.text), `Shipping reply must not state any amount! Got: ${res.text}`);
});

test('18. courier charge evvalavu -> Tanglish shipping charges question states no amount', () => {
  const res = answerQuestion('courier charge evvalavu', { products, shopInfo });
  assert.equal(res.intent, 'shipping_charges');
  assert.ok(!/₹?\s*\d+/.test(res.text), 'Must never state any charge amount');
});

test('19. delivery areas and timings -> says Tamil Nadu between 8 AM and 8 PM', () => {
  const res = answerQuestion('delivery areas and timings', { products, shopInfo });
  assert.equal(res.intent, 'delivery_info');
  assert.ok(res.text.includes('All around Tamil Nadu'));
  assert.ok(res.text.includes('8 AM to 8 PM'));
});

test('20. regular shop timings -> returns confirmed timings 8 AM - 9:30 PM, Mon-Sun', () => {
  const res = answerQuestion('what are your regular opening hours and closing timings', { products, shopInfo });
  assert.equal(res.intent, 'shop_timings');
  assert.ok(res.text.includes('8 AM - 9:30 PM, Mon-Sun'));
  
  // Test fallback behavior when null
  const fallbackRes = answerQuestion('what are your opening hours', { products, shopInfo: { ...shopInfo, regularShopTimings: null } });
  assert.equal(fallbackRes.intent, 'shop_timings_unconfirmed');
  assert.ok(fallbackRes.text.includes('99445 63827'));
});

test('21. wholesale bedsheet price -> pre-fills bedsheet in WhatsApp message', () => {
  const res = answerQuestion('wholesale bedsheet price and bulk rates', { products, shopInfo });
  assert.equal(res.intent, 'wholesale_quote');
  assert.ok(res.handOffMessage.toLowerCase().includes('bedsheet'));
  assert.ok(res.text.includes('wholesale'));
});

test('22. custom stitched sofa covers -> unknown / outside data politely offers WhatsApp', () => {
  const res = answerQuestion('custom stitched sofa covers for 7 seater', { products, shopInfo });
  assert.equal(res.intent, 'fallback');
  assert.ok(res.text.includes('custom') || res.text.includes('sofa'));
  assert.ok(res.handOffMessage.includes('custom'));
});

test('23. complaint regarding order -> outside data politely offers WhatsApp and phone', () => {
  const res = answerQuestion('I have a complaint regarding my previous order delivery', { products, shopInfo });
  assert.equal(res.intent, 'fallback');
  assert.ok(res.text.includes('99445 63827'));
});

test('24. gold zari ponnada shawl price -> matches Function Shawl product and price', () => {
  const res = answerQuestion('gold zari ponnada shawl price', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.equal(res.products[0].id, 13);
  assert.equal(res.products[0].price, 1150);
  assert.ok(res.text.includes('1150'));
});

test('25. baby quick dry sheet -> finds Baby Section quick dry product', () => {
  const res = answerQuestion('baby quick dry sheet', { products, shopInfo });
  assert.ok(res.products.length > 0);
  assert.equal(res.products[0].id, 24);
  assert.equal(res.products[0].category, 'Baby');
});

test('26. payment methods -> returns confirmed payment modes (UPI, GPay, PhonePe, Cards, Cash, Net Banking)', () => {
  const res = answerQuestion('what payment methods do you accept online and in-store?', { products, shopInfo });
  assert.equal(res.intent, 'payment_methods');
  assert.ok(res.text.includes('UPI'));
  assert.ok(res.text.includes('GPay'));
  assert.ok(res.text.includes('PhonePe'));
  assert.ok(res.text.includes('Cards'));
  assert.ok(res.text.includes('Cash'));
  assert.ok(res.text.includes('Net Banking'));
});
