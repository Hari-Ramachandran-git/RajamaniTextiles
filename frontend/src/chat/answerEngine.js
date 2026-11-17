import defaultShopInfo from '../data/shopInfo.json' with { type: 'json' };

/**
 * Normalizes input text: lowercases, removes punctuation, trims extra spaces.
 */
export function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s\u0B80-\u0BFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Common Tamil/Tanglish and typo stemming map.
 */
const STEM_SYNONYMS = {
  // Price
  vilai: 'price',
  vilay: 'price',
  vila: 'price',
  rate: 'price',
  rates: 'price',
  cost: 'price',
  evvalavu: 'price',
  evlo: 'price',
  amount: 'price',
  kammi: 'cheap',
  kammiya: 'cheap',
  cheapest: 'cheap',
  lowest: 'cheap',
  // Availability / Stock
  irukka: 'available',
  iruka: 'available',
  irukaa: 'available',
  irukkuma: 'available',
  iruku: 'available',
  kedaikuma: 'available',
  kidaikuma: 'available',
  stock: 'available',
  available: 'available',
  // Return / Exchange
  thirumba: 'return',
  thirumbavum: 'return',
  thiruppi: 'return',
  thirupi: 'return',
  mathikalam: 'exchange',
  exchange: 'return',
  replace: 'return',
  replacement: 'return',
  // Categories & Typos
  bedsheet: 'bedsheet',
  bedsheets: 'bedsheet',
  bedshets: 'bedsheet',
  bedset: 'bedsheet',
  twel: 'towel',
  twels: 'towel',
  towls: 'towel',
  towl: 'towel',
  towels: 'towel',
  towel: 'towel',
  pilow: 'pillow',
  pilows: 'pillow',
  pillows: 'pillow',
  pillow: 'pillow',
  matress: 'mattress',
  matresses: 'mattress',
  mattres: 'mattress',
  mattresses: 'mattress',
  methai: 'mattress',
  curtan: 'curtain',
  curtans: 'curtain',
  curtens: 'curtain',
  curtains: 'curtain',
  curtain: 'curtain',
  screens: 'curtain',
  screen: 'curtain',
  shawl: 'shawl',
  shawls: 'shawl',
  shawel: 'shawl',
  ponnada: 'shawl',
  ponnadai: 'shawl',
  angavastram: 'shawl',
  innerwear: 'innerwear',
  innerwears: 'innerwear',
  inner: 'innerwear',
  vest: 'innerwear',
  vests: 'innerwear',
  banian: 'innerwear',
  briefs: 'innerwear',
  trunks: 'innerwear',
  undergarment: 'innerwear',
  undergarments: 'innerwear',
  bedspread: 'bedspread',
  bedspreads: 'bedspread',
  bedcover: 'bedcover',
  bedcovers: 'bedcover',
  quilt: 'bedcover',
  // Shipping / Delivery
  delvery: 'delivery',
  delivary: 'delivery',
  deliver: 'delivery',
  courier: 'delivery',
  shiping: 'delivery',
  shipping: 'delivery',
  transport: 'delivery',
  // Festival / Holidays
  diwali: 'diwali',
  deepavali: 'diwali',
  deepawali: 'diwali',
  pongal: 'festival',
  festival: 'festival',
  festive: 'festival',
  holiday: 'festival',
  holidays: 'festival',
  // Wholesale
  wholsale: 'wholesale',
  wholesale: 'wholesale',
  bulk: 'wholesale',
  // Constraints
  undr: 'under',
  bellow: 'below'
};

const CATEGORIES = [
  { key: 'Baby', terms: ['baby', 'quick dry', 'gift box', 'umbrella net', 'nest', 'newborn', 'infant'] },
  { key: 'Inner Wears', terms: ['innerwear', 'inner wear', 'inner wears', 'vest', 'vests', 'briefs', 'trunks', 'banian', 'undergarments'] },
  { key: 'Function Shawls', terms: ['ponnada', 'ponnadai', 'angavastram', 'shawl', 'shawls'] },
  { key: 'Door and Window Screens', terms: ['door curtain', 'window curtain', 'curtain', 'curtains', 'screen', 'screens'] },
  { key: 'Bed Spread', terms: ['bedspread', 'bed spread', 'bedspreads'] },
  { key: 'Bedcover', terms: ['bedcover', 'bed cover', 'bedcovers', 'quilt'] },
  { key: 'Pillows', terms: ['ilavam panju', 'panju', 'silk cotton', 'microfiber', 'pillow', 'pillows'] },
  { key: 'Towels', terms: ['waffle towel', 'turkish towel', 'bath towel', 'hand towel', 'towel', 'towels'] },
  { key: 'Beds', terms: ['travel bed', 'mattress', 'mattresses', 'cot', 'bed', 'beds'] },
  { key: 'Bedsheets', terms: ['bedsheet', 'bed sheet', 'bedsheets', 'sheets', 'sheet'] }
];

const COLORS = ['crimson', 'gold', 'ivory', 'white', 'navy', 'emerald', 'rose', 'yellow', 'green', 'blue', 'pink', 'maroon', 'amber'];
const FABRICS = ['cotton', 'pure cotton', 'silk cotton', 'kapok', 'satin', 'microfiber', 'jacquard', 'chenille', 'waffle', 'terry', 'velvet'];

/**
 * Formats a WhatsApp URL with an encoded message.
 */
export function formatWhatsAppUrl(message, phone = '918667686067') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns human-readable stock badge text and style.
 */
export function getStockStatusText(stock) {
  if (stock === 'in_stock') return { text: 'In stock', isKnown: true, available: true };
  if (stock === 'low') return { text: 'Low stock', isKnown: true, available: true };
  if (stock === 'out') return { text: 'Out of stock', isKnown: true, available: false };
  return { text: 'Please check availability on WhatsApp', isKnown: false, available: null };
}

/**
 * Core Rule-Based Answer Engine.
 * Answers typed questions about products, prices, stock, returns, delivery, and shop availability.
 *
 * @param {string} rawQuery Customer's typed message
 * @param {object} options Context: { products, shopInfo, selectedPhone }
 * @returns {object} Formatted answer with text, products, options, intent, and hand-off message.
 */
export function answerQuestion(rawQuery = '', { products = [], shopInfo = defaultShopInfo, selectedPhone = '918667686067' } = {}) {
  const query = normalize(rawQuery);
  const words = query.split(/\s+/).filter(Boolean);

  // Expanded tokens with synonyms
  const tokens = words.map(w => STEM_SYNONYMS[w] || w);
  const tokenSet = new Set(tokens);
  const normalizedWithSynonyms = tokens.join(' ');

  // Helper matchers
  const hasToken = (...list) => list.some(item => tokenSet.has(item) || normalizedWithSynonyms.includes(item));
  const hasWord = regex => regex.test(normalizedWithSynonyms) || regex.test(query);

  // -------------------------------------------------------------
  // 0. OUTSIDE DATA CHECKS (COMPLAINTS, CUSTOM ORDERS)
  // -------------------------------------------------------------
  if (hasWord(/\b(complaint|complaints|issue|problem|damaged|wrong item|refund request|cancel order)\b/)) {
    return {
      intent: 'fallback',
      text: 'For complaints or issues regarding an existing order, please contact Mr. N. Subramanian directly at 99445 63827 or chat with us on WhatsApp so we can resolve it immediately.',
      products: [],
      options: [
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' },
        { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' }
      ],
      handOffMessage: `Hello Rajamani Textiles, I need assistance regarding an order issue: "${rawQuery}"`
    };
  }

  if (hasWord(/\b(custom|customized|customised|stitching|stitch|made to order|alteration|sofa cover|sofa covers)\b/)) {
    return {
      intent: 'fallback',
      text: 'We currently do not offer online listings for custom stitching or sofa covers. Please connect with Mr. N. Subramanian on WhatsApp or call 99445 63827 for custom textile orders.',
      products: [],
      options: [
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' },
        { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' },
        { label: '🛍️ Browse Products', action: 'browse_products' }
      ],
      handOffMessage: `Hello Rajamani Textiles, I would like to inquire about a custom order: "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 1. RETURNS & EXCHANGE
  // -------------------------------------------------------------
  const isReturnQuery = hasToken('return', 'exchange', 'thirumba', 'thiruppi', 'mathikalam') ||
    hasWord(/\b(return|returns|exchange|replace|replacement|refund)\b/);

  if (isReturnQuery) {
    const isInnerWear = hasToken('innerwear', 'vest', 'briefs', 'trunks', 'banian', 'undergarments') ||
      hasWord(/\b(inner|innerwear|vest|briefs|trunks)\b/);

    if (isInnerWear) {
      return {
        intent: 'returns_innerwear',
        text: shopInfo.returnsAndExchange?.excludedReason || 'Inner wears cannot be returned or exchanged.',
        products: [],
        options: [
          { label: 'Return policy', action: 'ask_returns' },
          { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
        ],
        handOffMessage: `Hello Rajamani Textiles, I have a question regarding return/exchange: "${rawQuery}"`
      };
    }

    // General return policy
    const conditions = shopInfo.returnsAndExchange?.conditions || 'The product must be returned as it is, without any stains or damage, and in almost the same packaging as it was sold.';
    const excluded = shopInfo.returnsAndExchange?.excludedReason ? ` Note: ${shopInfo.returnsAndExchange.excludedReason}` : '';
    return {
      intent: 'returns_general',
      text: `Returns and exchanges are available: ${conditions}${excluded}`,
      products: [],
      options: [
        { label: 'Delivery areas', action: 'ask_delivery' },
        { label: 'Store Address & Timings', action: 'store_info' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, I would like to inquire about your return and exchange policy: "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 2. SHIPPING CHARGES (MUST NEVER STATE AN AMOUNT)
  // -------------------------------------------------------------
  const isShippingChargeQuery = hasWord(/\b(shipping charge|shipping charges|delivery charge|delivery charges|delivery cost|courier charge|courier charges|how much for delivery|shipping cost|shipping fee|delivery fee)\b/) ||
    (hasToken('price', 'rate', 'cost') && hasToken('delivery', 'shipping', 'courier'));

  if (isShippingChargeQuery) {
    const note = shopInfo.delivery?.shippingChargesNote || 'Shipping charges depend on the delivery area and will be updated soon.';
    return {
      intent: 'shipping_charges',
      text: `${note} Please chat with us on WhatsApp for an exact delivery quote to your location.`,
      products: [],
      options: [
        { label: 'Delivery areas', action: 'ask_delivery' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, could you please provide a shipping quote for my area? "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 3. DELIVERY & COVERAGE
  // -------------------------------------------------------------
  const isDeliveryQuery = hasToken('delivery') || hasWord(/\b(deliver|delivers|delivery area|delivery areas|where do you deliver|delivery time|delivery window|tamil nadu)\b/);

  if (isDeliveryQuery) {
    const areas = shopInfo.delivery?.areas || 'All around Tamil Nadu';
    const window = shopInfo.delivery?.deliveryWindow || '8 AM to 8 PM';
    const festiveNote = shopInfo.delivery?.festiveNote ? ` ${shopInfo.delivery.festiveNote}` : '';
    return {
      intent: 'delivery_info',
      text: `Delivery is available ${areas}, between ${window}.${festiveNote}`,
      products: [],
      options: [
        { label: 'Shipping charges', action: 'ask_shipping_charges' },
        { label: 'Return policy', action: 'ask_returns' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, I want to inquire about delivery to my town: "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 4. FESTIVALS & SHOP AVAILABILITY / TIMINGS
  // -------------------------------------------------------------
  const isDiwaliQuery = hasToken('diwali') || hasWord(/\b(diwali|deepavali|deepawali)\b/);
  const isFestivalQuery = isDiwaliQuery || hasToken('festival') || hasWord(/\b(pongal|festival|festive|holiday|holidays|sunday)\b/);

  if (isFestivalQuery) {
    const festSeason = shopInfo.shopAvailability?.festivalSeasons || 'The shop is open during all festive seasons and on festival days, except on the day of Diwali.';
    return {
      intent: 'shop_festival_availability',
      text: festSeason,
      products: [],
      options: [
        { label: '📍 Store Address', action: 'store_info' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, I am checking store availability during festival days: "${rawQuery}"`
    };
  }

  // Regular Shop Timings (DO NOT GUESS WHEN NULL)
  const isTimingQuery = hasWord(/\b(timing|timings|opening hours|opening time|closing time|open time|when does the shop open|when do you close|hours)\b/);
  if (isTimingQuery) {
    if (shopInfo.regularShopTimings) {
      return {
        intent: 'shop_timings',
        text: `Our regular shop timings are: ${shopInfo.regularShopTimings}`,
        products: [],
        options: [
          { label: 'Store Address', action: 'store_info' },
          { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
        ],
        handOffMessage: `Hello Rajamani Textiles, checking your store opening timings: "${rawQuery}"`
      };
    }
    // Fallback when regularShopTimings is null
    return {
      intent: 'shop_timings_unconfirmed',
      text: 'Regular store timings are not currently confirmed in our system. Please call us directly at 99445 63827 or chat on WhatsApp to confirm opening hours today.',
      products: [],
      options: [
        { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, are you open today? "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 4b. PAYMENT METHODS
  // -------------------------------------------------------------
  const isPaymentQuery = hasWord(/\b(payment|payment mode|payment modes|payment methods|pay|gpay|google pay|phonepe|paytm|upi|credit card|debit card|cards|card payment|cash|net banking|netbanking|cod|cash on delivery)\b/);
  if (isPaymentQuery) {
    if (shopInfo.paymentMethods) {
      const summary = typeof shopInfo.paymentMethods === 'string'
        ? shopInfo.paymentMethods
        : shopInfo.paymentMethods.summary || 'We accept UPI (GPay, PhonePe), Credit/Debit Cards, Cash, and Net Banking for both in-store shopping and online orders.';
      return {
        intent: 'payment_methods',
        text: summary,
        products: [],
        options: [
          { label: 'Store Address & Timings', action: 'store_info' },
          { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
        ],
        handOffMessage: `Hello Rajamani Textiles, checking accepted payment methods: "${rawQuery}"`
      };
    }
    return {
      intent: 'payment_methods_unconfirmed',
      text: 'Accepted payment methods are not currently confirmed in our system. Please contact Mr. N. Subramanian at 99445 63827 or chat on WhatsApp.',
      products: [],
      options: [
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' },
        { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' }
      ],
      handOffMessage: `Hello Rajamani Textiles, how can I make a payment? "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 5. WHOLESALE & BULK ORDERS
  // -------------------------------------------------------------
  const isWholesaleQuery = hasToken('wholesale') || hasWord(/\b(wholesale|bulk|marriage order|hotel order|hospital order|reseller|slabs)\b/);

  if (isWholesaleQuery) {
    const hasSlabs = Array.isArray(shopInfo.wholesale?.slabs) && shopInfo.wholesale.slabs.length > 0;
    if (hasSlabs) {
      const slabList = shopInfo.wholesale.slabs.map(s => `${s.quantity}+ units: ₹${s.rate}`).join(', ');
      return {
        intent: 'wholesale_slabs',
        text: `Wholesale slabs: ${slabList}. Minimum quantity: ${shopInfo.wholesale.minimumQuantity || 'N/A'}.`,
        products: [],
        options: [
          { label: 'Chat on WhatsApp', action: 'open_wholesale_wa' },
          { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' }
        ],
        handOffMessage: `Hello Rajamani Textiles, inquiring about wholesale slabs for bulk order.`
      };
    }

    // Identify if user mentioned a category or product
    let targetedProduct = null;
    for (const p of products) {
      const pNameLower = p.name.toLowerCase();
      if (normalizedWithSynonyms.includes(pNameLower) || pNameLower.split(' ').some(w => w.length > 4 && normalizedWithSynonyms.includes(w))) {
        targetedProduct = p.name;
        break;
      }
    }
    if (!targetedProduct) {
      for (const cat of CATEGORIES) {
        if (cat.terms.some(t => normalizedWithSynonyms.includes(t))) {
          targetedProduct = cat.key;
          break;
        }
      }
    }

    const handOffItem = targetedProduct ? targetedProduct : 'bulk textiles';
    return {
      intent: 'wholesale_quote',
      text: `Wholesale slab rates are tailored directly to your quantity. Please connect on WhatsApp with Mr. N. Subramanian for direct loom wholesale pricing and quotation.`,
      products: [],
      options: [
        { label: '📲 Wholesale on WhatsApp', action: 'open_wholesale_wa' },
        { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' }
      ],
      handOffMessage: `Hello Mr. N. Subramanian (Rajamani Textiles), I am looking for a wholesale price quote for ${handOffItem}. Please share bulk discounts and catalogue.`
    };
  }

  // -------------------------------------------------------------
  // 6. PRODUCT SEARCH, PRICES, STOCK, OPTIONS
  // -------------------------------------------------------------
  // Identify Category using exact word boundaries
  let matchedCategory = null;
  if (/\b(baby|quick dry|gift box|umbrella net|nest|newborn|infant)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Baby';
  } else if (/\b(bedsheet|bedsheets|bed sheet|bed sheets)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Bedsheets';
  } else if (/\b(bedspread|bedspreads|bed spread|bed spreads)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Bed Spread';
  } else if (/\b(bedcover|bedcovers|bed cover|bed covers|quilt)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Bedcover';
  } else if (/\b(pillow|pillows|ilavam panju|panju|silk cotton|microfiber)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Pillows';
  } else if (/\b(towel|towels|bath towel|waffle towel|turkish towel|hand towel|waffle)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Towels';
  } else if (/\b(shawl|shawls|ponnada|ponnadai|angavastram)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Function Shawls';
  } else if (/\b(innerwear|inner wear|inner wears|vest|vests|briefs|trunks|banian|undergarments)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Inner Wears';
  } else if (/\b(curtain|curtains|screen|screens|door curtain|window curtain)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Door and Window Screens';
  } else if (/\b(mattress|mattresses|cot|travel bed|floor bed|bed|beds)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Beds';
  } else if (/\b(sheets|sheet)\b/.test(normalizedWithSynonyms)) {
    matchedCategory = 'Bedsheets';
  }

  let matchedColor = null;
  for (const c of COLORS) {
    if (normalizedWithSynonyms.includes(c) || query.includes(c)) {
      matchedColor = c;
      break;
    }
  }

  let matchedFabric = null;
  for (const f of FABRICS) {
    if (normalizedWithSynonyms.includes(f) || query.includes(f)) {
      matchedFabric = f;
      break;
    }
  }

  // Check price constraints (e.g. "under 500", "below 1000", "< 600", "undr 500")
  let maxPrice = null;
  const priceMatch = normalizedWithSynonyms.match(/(?:under|below|less than|within|<)\s*₹?\s*(\d+)/i) ||
    normalizedWithSynonyms.match(/(\d+)\s*(?:kulle|kulla|below|under)/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1], 10);
  }

  const isCheapestSort = hasToken('cheap') || hasWord(/\b(cheapest|lowest|lowest price|budget|kammi|kammiya)\b/);
  const isPriceQuery = hasToken('price') || hasWord(/\b(price|prices|rate|rates|cost|vilai|evvalavu|evlo)\b/);
  const isStockQuery = hasToken('available') || hasWord(/\b(available|availability|stock|irukka|iruka|irukaa|in stock|kedaikuma|kidaikuma)\b/);

  // Pool of candidate products
  const pool = matchedCategory
    ? products.filter(p => p.category === matchedCategory)
    : products;

  // Score candidate products
  const scoredProducts = pool.map(p => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const colorLower = (p.color || '').toLowerCase();
    const matLower = (p.material || '').toLowerCase();

    // Exact name match or contains full name
    if (normalizedWithSynonyms.includes(nameLower) || query.includes(nameLower)) {
      score += 60;
    }

    // Word overlap with product name
    const pWords = nameLower.split(/\s+/).filter(w => w.length > 2);
    for (const w of pWords) {
      if (words.some(qw => qw.includes(w) || w.includes(qw)) || tokens.some(tk => tk.includes(w) || w.includes(tk))) {
        score += 10;
      }
    }

    // Category match
    if (matchedCategory && p.category === matchedCategory) {
      score += 20;
    }

    // Color match
    if (matchedColor && colorLower.includes(matchedColor)) {
      score += 25;
    }

    // Fabric match
    if (matchedFabric && (matLower.includes(matchedFabric) || descLower.includes(matchedFabric))) {
      score += 15;
    }

    // Max price constraint
    if (maxPrice !== null) {
      if (p.price <= maxPrice) {
        score += 10;
      } else {
        score = -100; // exclude
      }
    }

    return { product: p, score };
  }).filter(item => item.score > 0);

  // Require minimum relevance threshold if no category or color was explicitly matched
  const minScoreThreshold = (!matchedCategory && !matchedColor && !matchedFabric) ? 20 : 10;
  const filteredScored = scoredProducts.filter(item => item.score >= minScoreThreshold);

  // Sort
  if (isCheapestSort) {
    filteredScored.sort((a, b) => a.product.price - b.product.price || b.score - a.score);
  } else {
    filteredScored.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  }

  const matchingProducts = filteredScored.slice(0, 3).map(x => x.product);

  if (matchingProducts.length > 0) {
    const top = matchingProducts[0];
    let replyText = '';
    const followUps = [];

    // Is it a specific product query? (e.g. "waffle towel", "gold zari ponnada", "double bedsheet")
    const specificKeywordMatch = words.some(w => w.length > 3 && !['towel', 'towels', 'bedsheet', 'bedsheets', 'pillow', 'pillows', 'curtain', 'curtains', 'screen', 'screens', 'sheet', 'sheets', 'price', 'rates', 'stock', 'available', 'irukka'].includes(w) && top.name.toLowerCase().includes(w));
    const isSpecificProduct = matchingProducts.length === 1 ||
      specificKeywordMatch ||
      (filteredScored[0].score >= 35 && (filteredScored.length === 1 || filteredScored[0].score - (filteredScored[1]?.score || 0) >= 10));

    if (isStockQuery) {
      if (isSpecificProduct) {
        if (top.stock === 'in_stock') {
          replyText = `${top.name} is In stock for ₹${top.price}.`;
        } else if (top.stock === 'low') {
          replyText = `${top.name} has Low stock (few items remaining) for ₹${top.price}.`;
        } else if (top.stock === 'out') {
          replyText = `${top.name} is currently out of stock.`;
        } else {
          replyText = `${top.name} is ₹${top.price}. Please check availability on WhatsApp.`;
        }
      } else {
        replyText = `Found ${matchingProducts.length} matching items. Stock availability is shown on each card below:`;
      }
    } else if (isCheapestSort) {
      replyText = `Our most affordable ${matchedCategory || 'textile'} is ${top.name} at ₹${top.price}.`;
    } else if (maxPrice !== null) {
      replyText = `Here are our ${matchedCategory || 'textile'} options under ₹${maxPrice}:`;
    } else if (isPriceQuery) {
      if (isSpecificProduct) {
        replyText = `${top.name} is priced at ₹${top.price}${top.originalPrice ? ` (MRP ₹${top.originalPrice})` : ''}.`;
      } else {
        const prices = matchingProducts.map(p => p.price);
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        replyText = minP === maxP
          ? `Here are our ${matchedCategory || 'textile'} options, priced at ₹${minP}:`
          : `Here are our ${matchedCategory || 'textile'} options, priced from ₹${minP} to ₹${maxP}:`;
      }
    } else {
      replyText = `Here are our top ${matchedCategory || ''} recommendations:`;
    }

    // Dynamic Follow-up chips
    if (matchedCategory) {
      followUps.push({ label: `See all ${matchedCategory.toLowerCase()}`, action: `cat_${matchedCategory.toLowerCase()}` });
    }
    followUps.push({ label: 'Return policy', action: 'ask_returns' });
    followUps.push({ label: 'Delivery areas', action: 'ask_delivery' });
    followUps.push({ label: 'Wholesale rates', action: 'wholesale_info' });
    followUps.push({ label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' });

    return {
      intent: 'product_match',
      text: replyText,
      products: matchingProducts,
      options: followUps.slice(0, 5),
      handOffMessage: `Hello Rajamani Textiles, I am interested in ${top.name} (₹${top.price}): "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 7. GREETINGS
  // -------------------------------------------------------------
  if (hasWord(/\b(hi|hello|vanakkam|namaste|hey|good morning|good evening)\b/)) {
    return {
      intent: 'greeting',
      text: 'Vanakkam! 🙏 Welcome to RAJAMANI TEXTILES. We stock Bedsheets, Towels, Pillows, Mattresses, Baby Beds, Shawls, Innerwear, Curtains, and Bedcovers. How can I assist you?',
      products: [],
      options: [
        { label: '🛍️ Browse Products & Rates', action: 'browse_products' },
        { label: '👶 Baby Section', action: 'baby_beds' },
        { label: '🏢 Wholesale / Bulk Order', action: 'wholesale_info' },
        { label: '📍 Store Address & Timings', action: 'store_info' },
        { label: '🚚 Shipping & Delivery', action: 'shipping_info' }
      ],
      handOffMessage: 'Hello Rajamani Textiles, I am on your website and would like to chat.'
    };
  }

  // -------------------------------------------------------------
  // 8. STORE CONTACT / ADDRESS
  // -------------------------------------------------------------
  if (hasWord(/\b(address|location|where is the shop|madurai|vilakkuthoon|route|map|phone|call|number|contact)\b/)) {
    return {
      intent: 'store_address',
      text: 'RAJAMANI TEXTILES is located at 15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001 (near Thirumalai Nayakkar Mahal). Proprietor: N. Subramanian (📞 99445 63827).',
      products: [],
      options: [
        { label: '🗺️ Open in Google Maps', externalUrl: 'https://maps.google.com/?q=15+Mahal+Vadampokki+Street+Vilakkuthoon+Madurai+625001' },
        { label: '📞 Call Store Now', externalUrl: 'tel:9944563827' },
        { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' }
      ],
      handOffMessage: `Hello Rajamani Textiles, checking your store location: "${rawQuery}"`
    };
  }

  // -------------------------------------------------------------
  // 9. FALLBACK / OUTSIDE DATA
  // -------------------------------------------------------------
  return {
    intent: 'fallback',
    text: `I couldn't find an exact match for "${rawQuery}" in our current product catalog. Please connect with Mr. N. Subramanian directly on WhatsApp or call 99445 63827 for personal assistance.`,
    products: [],
    options: [
      { label: 'Chat on WhatsApp', action: 'open_whatsapp_direct' },
      { label: '📞 Call 99445 63827', externalUrl: 'tel:9944563827' },
      { label: '🛍️ Browse All Textiles', action: 'browse_products' },
      { label: '🚚 Delivery info', action: 'ask_delivery' }
    ],
    handOffMessage: `Hello Rajamani Textiles, I had a question on your website: "${rawQuery}"`
  };
}
