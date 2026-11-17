import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPincode, saveOrderToHistory, getRecentOrders, findOrder, getOrderTimeline, buildWhatsAppOrderMessage } from './orders.js';

test('checkPincode validates 6-digit Indian pincodes accurately', () => {
  // Invalid pincodes
  assert.equal(checkPincode('').valid, false);
  assert.equal(checkPincode('123').valid, false);
  assert.equal(checkPincode('012345').valid, false);
  assert.equal(checkPincode('ABCDEF').valid, false);
  assert.equal(checkPincode('6250019').valid, false);

  // Tamil Nadu pincodes (starts with 6)
  const madurai = checkPincode('625001');
  assert.equal(madurai.valid, true);
  assert.equal(madurai.deliverable, true);
  assert.equal(madurai.region, 'Tamil Nadu');
  assert.equal(madurai.deliveryWindow, '8 AM to 8 PM');
  assert.ok(madurai.message.includes('Tamil Nadu'));

  const chennai = checkPincode('600001');
  assert.equal(chennai.region, 'Tamil Nadu');

  // Rest of India pincodes (e.g. Bangalore 560001, Mumbai 400001, Delhi 110001)
  const bangalore = checkPincode('560001');
  assert.equal(bangalore.valid, true);
  assert.equal(bangalore.deliverable, true);
  assert.equal(bangalore.region, 'Rest of India');
  assert.ok(bangalore.message.includes('Interstate Express Courier'));
});

test('saveOrderToHistory and findOrder persist and retrieve orders', () => {
  const store = new Map();
  const mockStorage = {
    getItem: k => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v))
  };

  const sampleOrder = {
    id: 'RT-DEMO-2026-TEST01',
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Ramanathan',
      phone: '9842100000',
      address: '10 Vilakkuthoon',
      city: 'Madurai',
      postalCode: '625001'
    },
    items: [{ id: 1, name: 'Double Bedsheet', unitPrice: 890, quantity: 1 }],
    subtotal: 890,
    shipping: 99,
    total: 989,
    paymentMethod: 'UPI'
  };

  saveOrderToHistory(sampleOrder, mockStorage);

  const list = getRecentOrders(mockStorage);
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 'RT-DEMO-2026-TEST01');

  // Find by exact ID
  const foundById = findOrder('RT-DEMO-2026-TEST01', mockStorage);
  assert.ok(foundById);
  assert.equal(foundById.customer.name, 'Ramanathan');

  // Find with lowercase or # prefix
  assert.ok(findOrder('#rt-demo-2026-test01', mockStorage));
  assert.ok(findOrder('TEST01', mockStorage));

  // Find by phone number
  assert.ok(findOrder('9842100000', mockStorage));

  // Unknown lookup
  assert.equal(findOrder('DOESNOTEXIST', mockStorage), null);
});

test('getOrderTimeline provides progressive milestones with Tamil Nadu timings', () => {
  const sample = {
    id: 'RT-DEMO-2026-TEST02',
    createdAt: new Date().toISOString(),
    customer: { postalCode: '625001' }
  };
  const timeline = getOrderTimeline(sample);
  assert.equal(timeline.length, 4);
  assert.equal(timeline[0].status, 'completed');
  assert.ok(timeline[0].title.includes('Confirmed'));
  assert.ok(timeline[2].title.includes('8 AM – 8 PM Window'));
});

test('buildWhatsAppOrderMessage formats complete order summary for WhatsApp handoff', () => {
  const order = {
    id: 'RT-DEMO-2026-WA001',
    total: 1290,
    customer: { name: 'Karthik', city: 'Madurai', postalCode: '625001' },
    paymentMethod: 'Cash on Delivery'
  };
  const msg = decodeURIComponent(buildWhatsAppOrderMessage(order));
  assert.ok(msg.includes('RT-DEMO-2026-WA001'));
  assert.ok(msg.includes('1290'));
  assert.ok(msg.includes('Karthik'));
  assert.ok(msg.includes('Madurai'));
  assert.ok(msg.includes('Cash on Delivery'));
});
