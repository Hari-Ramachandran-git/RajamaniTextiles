// Order processing, Pincode validation, and Order tracking persistence for Rajamani Textiles

export const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay cash upon package delivery at your doorstep.',
    icon: 'Banknote'
  }
];

/**
 * Validates an Indian 6-digit postal PIN code and checks deliverability.
 * Tamil Nadu postal circle codes start with '6' (Madurai 625xxx, Chennai 600xxx, etc.)
 */
export function checkPincode(pin) {
  if (!pin) {
    return {
      valid: false,
      deliverable: false,
      message: 'Please enter a 6-digit postal PIN code.'
    };
  }

  const clean = String(pin).trim();
  if (!/^[1-9]\d{5}$/.test(clean)) {
    return {
      valid: false,
      deliverable: false,
      message: 'Please enter a valid 6-digit Indian PIN code.'
    };
  }

  const isTamilNadu = clean.startsWith('6');

  if (isTamilNadu) {
    return {
      valid: true,
      deliverable: true,
      region: 'Tamil Nadu',
      pincode: clean,
      deliveryWindow: '8 AM to 8 PM',
      deliveryEstimate: 'Standard 24–48 Hours Delivery',
      badge: 'Tamil Nadu Priority',
      message: 'Deliverable across Tamil Nadu. Delivery window: 8 AM to 8 PM.'
    };
  }

  return {
    valid: true,
    deliverable: true,
    region: 'Rest of India',
    pincode: clean,
    deliveryWindow: 'Interstate Courier Window (9 AM to 7 PM)',
    deliveryEstimate: '3 to 5 Business Days',
    badge: 'All India Delivery',
    message: 'Deliverable across India via Interstate Express Courier from Madurai.'
  };
}

function safeStorage(customStorage) {
  if (customStorage) return customStorage;
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const ORDERS_KEY = 'rt-order-history';

/**
 * Persists an order into customer local history for status tracking.
 */
export function saveOrderToHistory(orderRecord, storage = safeStorage()) {
  if (!orderRecord || !orderRecord.id) return null;
  try {
    if (!storage) return orderRecord;
    const existing = getRecentOrders(storage);
    const filtered = existing.filter(o => o.id !== orderRecord.id);
    const updated = [orderRecord, ...filtered].slice(0, 50);
    storage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return orderRecord;
  } catch {
    return orderRecord;
  }
}

/**
 * Retrieves all orders saved on this device.
 */
export function getRecentOrders(storage = safeStorage()) {
  try {
    if (!storage) return [];
    const raw = storage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Finds an order by its ID or by matching phone number.
 */
export function findOrder(query, storage = safeStorage()) {
  if (!query || typeof query !== 'string') return null;
  const normalized = query.trim().toUpperCase().replace(/^#/, '');
  if (!normalized) return null;

  const orders = getRecentOrders(storage);
  // Match exact ID
  let match = orders.find(o => o.id.toUpperCase() === normalized);
  if (match) return match;

  // Partial ID match (e.g. user entered 2026-XXXX)
  match = orders.find(o => o.id.toUpperCase().includes(normalized));
  if (match) return match;

  // Match by phone number if query is 10 digits
  if (/^\d{10}$/.test(normalized)) {
    match = orders.find(o => o.customer && o.customer.phone === normalized);
    if (match) return match;
  }

  // Fallback to rt-last-demo-order
  try {
    if (storage) {
      const lastRaw = storage.getItem('rt-last-demo-order');
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (last && (last.id.toUpperCase() === normalized || last.id.toUpperCase().includes(normalized))) {
          return last;
        }
      }
    }
  } catch {
    // Ignore fallback errors
  }

  return null;
}

/**
 * Builds a timeline of milestones for an order.
 */
export function getOrderTimeline(order) {
  const createdDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const formatTime = d => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Simulate progress steps:
  // Step 1: Confirmed
  // Step 2: Packed at Vilakkuthoon Loom Facility
  // Step 3: Out for Delivery (8 AM to 8 PM)
  // Step 4: Delivered
  const isTN = order?.customer?.postalCode ? checkPincode(order.customer.postalCode).region === 'Tamil Nadu' : true;

  return [
    {
      id: 'confirmed',
      title: 'Order Placed & Confirmed',
      description: `Received at Rajamani Textiles, Vilakkuthoon on ${formatDate(createdDate)} at ${formatTime(createdDate)}.`,
      status: 'completed',
      date: formatDate(createdDate),
      time: formatTime(createdDate)
    },
    {
      id: 'packed',
      title: 'Inspected & Packed at Loom Facility',
      description: 'Handcrafted items carefully quality-checked and packaged in moisture-proof protective wrap.',
      status: 'current',
      facility: '15, Mahal Vadampokki St, Madurai'
    },
    {
      id: 'dispatched',
      title: isTN ? 'Out for Delivery (8 AM – 8 PM Window)' : 'Handed to Interstate Express Courier',
      description: isTN 
        ? 'Standard delivery window 8 AM to 8 PM across Tamil Nadu.' 
        : 'Dispatched via Indian Postal / Express Courier from Madurai hub.',
      status: 'upcoming'
    },
    {
      id: 'delivered',
      title: 'Delivered to Customer Doorstep',
      description: 'Package delivered safely with confirmation receipt.',
      status: 'upcoming'
    }
  ];
}

/**
 * Formats order details for sharing or customer WhatsApp notification.
 */
export function buildWhatsAppOrderMessage(order) {
  if (!order) return '';
  const lines = [
    `Vanakkam Rajamani Textiles!`,
    `I have placed an order on your website.`,
    `Order Reference: ${order.id}`,
    `Total Amount: ₹${order.total}`,
    order.customer?.name ? `Customer Name: ${order.customer.name}` : null,
    order.customer?.city ? `Delivery City: ${order.customer.city} (${order.customer.postalCode || ''})` : null,
    order.paymentMethod ? `Payment Mode: ${order.paymentMethod}` : null,
    `Please confirm the dispatch schedule. Thank you!`
  ].filter(Boolean);

  return encodeURIComponent(lines.join('\n'));
}
