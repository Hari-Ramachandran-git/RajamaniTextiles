import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Send, Phone, ArrowRight, MapPin, 
  Package, CheckCheck, Building2, ExternalLink, 
  ChevronDown, Clock, Truck, ShoppingBag, Sparkles, Plus, Check
} from 'lucide-react';
import { NandiEmblem, productUrl, imageSrc, money } from './StorePages.jsx';
import { answerQuestion, formatWhatsAppUrl, getStockStatusText } from './chat/answerEngine.js';
import defaultShopInfo from './data/shopInfo.json' with { type: 'json' };

export function WhatsAppIcon({ size = 24, className = '', style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const PRIMARY_WA = '918667686067';
const SECONDARY_WA = '916379380253';
const CALL_PHONE = '9944563827';

const initialGreeting = [
  {
    id: 1,
    sender: 'bot',
    text: 'Vanakkam! 🙏 Welcome to RAJAMANI TEXTILES, Madurai.',
    time: 'Just now'
  },
  {
    id: 2,
    sender: 'bot',
    text: 'I am your instant WhatsApp store assistant. We deal in Wholesale & Retail Bedsheets, Towels, Pillows, Mattresses, Baby Section (Beds, Quick Dry & Gifts), Shawls, Innerwear, Curtains, and Bedcovers.\n\nHow can I help you today?',
    time: 'Just now',
    options: [
      { label: '🛍️ Browse Products & Rates', action: 'browse_products' },
      { label: '👶 Baby Section (Beds, Quick Dry, Gifts)', action: 'baby_beds' },
      { label: '🏢 Wholesale / Bulk Order', action: 'wholesale_info' },
      { label: '📍 Store Address & Timings', action: 'store_info' },
      { label: '🚚 Shipping & Delivery', action: 'shipping_info' },
      { label: '💬 Chat on WhatsApp', action: 'open_whatsapp_direct' }
    ]
  }
];

function loadSavedMessages() {
  try {
    const raw = sessionStorage.getItem('rt-chat-messages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialGreeting;
}

function loadSavedLastQuery() {
  try {
    return sessionStorage.getItem('rt-chat-last-query') || '';
  } catch {}
  return '';
}

export function WhatsAppChatBot({ products = [], goShop, add }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState(PRIMARY_WA);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastQuery, setLastQuery] = useState(loadSavedLastQuery);
  const [addedIds, setAddedIds] = useState(new Set());
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(loadSavedMessages);

  // Persist chat history across page navigation and refresh
  useEffect(() => {
    try {
      sessionStorage.setItem('rt-chat-messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      if (lastQuery) sessionStorage.setItem('rt-chat-last-query', lastQuery);
    } catch {}
  }, [lastQuery]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function addMessage(sender, text, options = null, productCards = null, handOffMessage = '') {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
        time,
        options,
        productCards,
        handOffMessage
      }
    ]);
  }

  function handleAddToCart(product) {
    if (add) {
      add(product, 1);
      setAddedIds(prev => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedIds(prev => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 2500);
    }
  }

  function handleQuickAction(action, customText = '') {
    if (customText) {
      addMessage('user', customText);
      setLastQuery(customText);
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      switch (action) {
        case 'browse_products':
          addMessage(
            'bot',
            'We stock genuine Madurai handloom & home essentials at direct loom wholesale & retail prices. Which category would you like to explore?',
            [
              { label: 'Bedsheets (Single/Double/King)', action: 'cat_bedsheets' },
              { label: 'Towels (Waffle & Turkish)', action: 'cat_towels' },
              { label: 'Baby Section (Beds, Quick Dry, Gifts)', action: 'baby_beds' },
              { label: 'Pillows (Pure Ilavam Panju)', action: 'cat_pillows' },
              { label: 'Beds & Foldable Mattresses', action: 'cat_beds' },
              { label: 'Function Shawls (Ponnada)', action: 'cat_shawls' },
              { label: 'Door & Window Screens', action: 'cat_screens' },
              { label: 'Bed Spreads & Covers', action: 'cat_bedspreads' }
            ]
          );
          break;

        case 'baby_beds':
          addMessage(
            'bot',
            '✨ Baby Section & Essentials:\n\n1️⃣ 3-in-1 Foldable Baby Travel Bed & Carry Nest Bag — ₹990\n• 3 convertible modes with warm plush fleece interior.\n\n2️⃣ Baby Waterproof Quick Dry Sheet (Pack of 2) — ₹390\n• Breathable TPU membrane, absorbs spills & dries 8x faster.\n\n3️⃣ Newborn Luxury Care & Clothing Gift Box Set — ₹1,290\n• 6-piece gift hamper with cotton jhabla, bottle, nappy swaddle, soap, powder & buds.\n\n4️⃣ Foldable Pop-Up Umbrella Baby Mosquito Net — ₹490\n• Instant pull-string umbrella net with lace trim & fine mesh.\n\n5️⃣ Newborn Baby Bed with Zip Net Canopy & Bolsters — ₹790\n\n6️⃣ Organic Cotton Waterproof Sleeping Nest — ₹890\n\nWould you like to order on WhatsApp or browse the collection?',
            [
              { label: '📲 Inquire on WhatsApp', action: 'order_baby_wa' },
              { label: '🔍 View Baby Section in Store', action: 'view_baby_beds' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ]
          );
          break;

        case 'order_baby_wa': {
          const waUrl = formatWhatsAppUrl('Hello Rajamani Textiles, I am interested in purchasing items from your Baby Section (Travel Bed / Quick Dry Sheet / Gift Box / Umbrella Net). Please share details.', selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          addMessage('bot', 'Opening WhatsApp to chat about our Baby Section with Mr. N. Subramanian:', [
            { label: 'Open WhatsApp Now', externalUrl: waUrl },
            { label: '↩️ Main Menu', action: 'main_menu' }
          ]);
          break;
        }

        case 'view_baby_beds':
          setIsOpen(false);
          if (goShop) goShop('Baby');
          break;

        case 'cat_bedsheets': {
          const bedsheets = products.filter(p => p.category === 'Bedsheets').slice(0, 3);
          addMessage(
            'bot',
            '🛏️ Bedsheets Collection (Single, Double & King 100% Pure Cotton with pillow covers):',
            [
              { label: '🔍 View All Bedsheets', action: 'view_bedsheets' },
              { label: '📲 Inquire on WhatsApp', action: 'inquire_bedsheets' },
              { label: '↩️ Back to Categories', action: 'browse_products' }
            ],
            bedsheets
          );
          break;
        }

        case 'view_bedsheets':
          setIsOpen(false);
          if (goShop) goShop('Bedsheets');
          break;

        case 'inquire_bedsheets': {
          const waUrl = formatWhatsAppUrl('Hello Rajamani Textiles, I am interested in purchasing Cotton Bedsheets. Please send latest designs and pricing.', selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          addMessage('bot', 'Connecting you to WhatsApp for bedsheet designs and bulk rates.', [
            { label: 'Open WhatsApp Now', externalUrl: waUrl },
            { label: '↩️ Main Menu', action: 'main_menu' }
          ]);
          break;
        }

        case 'cat_towels': {
          const towels = products.filter(p => p.category === 'Towels').slice(0, 3);
          addMessage(
            'bot',
            '🛁 Towels & Bath Linens (Waffle & Turkish 100% pure cotton):',
            [
              { label: '🔍 View Towels in Store', action: 'view_towels' },
              { label: '📲 Bulk Towels on WhatsApp', action: 'inquire_towels' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            towels
          );
          break;
        }

        case 'view_towels':
          setIsOpen(false);
          if (goShop) goShop('Towels');
          break;

        case 'inquire_towels': {
          const waUrl = formatWhatsAppUrl('Hello Rajamani Textiles, I am inquiring about Cotton Bath & Waffle Towels. Please share wholesale and retail prices.', selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          break;
        }

        case 'cat_pillows': {
          const pillows = products.filter(p => p.category === 'Pillows').slice(0, 2);
          addMessage(
            'bot',
            '☁️ Pillows (Pure Ilavam Panju Silk Cotton & Cloud Microfiber):',
            [
              { label: '🔍 View Pillows', action: 'view_pillows' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            pillows
          );
          break;
        }

        case 'view_pillows':
          setIsOpen(false);
          if (goShop) goShop('Pillows');
          break;

        case 'cat_beds': {
          const beds = products.filter(p => p.category === 'Beds').slice(0, 2);
          addMessage(
            'bot',
            '🛏️ Beds & Mattresses (Hand-Tufted Silk Cotton & Foldable Travel Beds):',
            [
              { label: '📲 Custom Mattress Quote on WhatsApp', action: 'inquire_mattress' },
              { label: '🔍 View Beds', action: 'view_beds' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            beds
          );
          break;
        }

        case 'view_beds':
          setIsOpen(false);
          if (goShop) goShop('Beds');
          break;

        case 'inquire_mattress': {
          const waUrl = formatWhatsAppUrl('Hello Rajamani Textiles, I want to inquire about Ilavam Panju cotton mattress custom sizes and pricing.', selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          break;
        }

        case 'cat_shawls': {
          const shawls = products.filter(p => p.category === 'Function Shawls').slice(0, 2);
          addMessage(
            'bot',
            '🎗️ Function Shawls (Royal Gold Zari Ponnadas & Wedding Honour Shawls):',
            [
              { label: '🔍 View Function Shawls', action: 'view_shawls' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            shawls
          );
          break;
        }

        case 'view_shawls':
          setIsOpen(false);
          if (goShop) goShop('Function Shawls');
          break;

        case 'cat_screens': {
          const screens = products.filter(p => p.category === 'Door and Window Screens').slice(0, 2);
          addMessage(
            'bot',
            '🚪 Curtains & Screens (7ft Door & 5ft Window Jacquard Curtains):',
            [
              { label: '🔍 View Screens & Curtains', action: 'view_screens' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            screens
          );
          break;
        }

        case 'view_screens':
          setIsOpen(false);
          if (goShop) goShop('Door and Window Screens');
          break;

        case 'cat_bedspreads': {
          const spreads = products.filter(p => p.category === 'Bed Spread' || p.category === 'Bedcover').slice(0, 3);
          addMessage(
            'bot',
            '👑 Bed Spreads & Bed Covers (Handloom Jacquard & Quilted Reversible):',
            [
              { label: '🔍 View Bed Spreads', action: 'view_bedspreads' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ],
            spreads
          );
          break;
        }

        case 'view_bedspreads':
          setIsOpen(false);
          if (goShop) goShop('Bed Spread');
          break;

        case 'wholesale_info': {
          const ans = answerQuestion('wholesale bulk rates', { products, shopInfo: defaultShopInfo, selectedPhone: selectedNumber });
          addMessage(
            'bot',
            `🏢 Wholesale & Bulk Order Enquiries:\n\n${ans.text}\n\nWe directly supply for:\n• Marriage function orders & return gifts\n• Hotels, Resorts & Guest Houses\n• Hospitals, Hostels & Institutions\n• Retailers across Tamil Nadu\n\nProprietor: Mr. N. Subramanian\n📞 Call: ${CALL_PHONE}\n💬 WhatsApp: 86676 86067 / 63793 80253`,
            ans.options,
            null,
            ans.handOffMessage
          );
          break;
        }

        case 'open_wholesale_wa': {
          const waUrl = formatWhatsAppUrl('Hello Mr. N. Subramanian (Rajamani Textiles), I am looking for a wholesale price quote for bulk order. Please share your wholesale catalogue and discounts.', selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          addMessage('bot', 'Connecting you to Mr. N. Subramanian for wholesale quotation.', [
            { label: 'Continue on WhatsApp', externalUrl: waUrl },
            { label: '↩️ Main Menu', action: 'main_menu' }
          ]);
          break;
        }

        case 'store_info': {
          // Source of Truth: shopInfo.json
          const festivalNotice = defaultShopInfo.shopAvailability?.festivalSeasons || 'The shop is open during all festive seasons and on festival days, except on the day of Diwali.';
          const timingsNotice = defaultShopInfo.regularShopTimings
            ? `⏰ Timings: ${defaultShopInfo.regularShopTimings}`
            : '⏰ Regular Shop Timings: Regular store timings are not currently confirmed. Please call 99445 63827 or chat on WhatsApp to confirm opening hours today.';
          const paymentNotice = defaultShopInfo.paymentMethods?.summary
            ? `\n\n💳 Accepted Payment Modes:\n${defaultShopInfo.paymentMethods.summary}`
            : '';

          addMessage(
            'bot',
            `📍 Store Address & Visit Details:\n\nRAJAMANI TEXTILES\n15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001.\n\n🏛️ Landmark: Right in the historic textile hub near Thirumalai Nayakkar Mahal & Vilakkuthoon.\n\n${timingsNotice}\n\n🎉 Festival Availability:\n${festivalNotice}${paymentNotice}\n\nProprietor: N. Subramanian\n📞 Call: 99445 63827`,
            [
              { label: '🗺️ Open in Google Maps', externalUrl: 'https://maps.google.com/?q=15+Mahal+Vadampokki+Street+Vilakkuthoon+Madurai+625001' },
              { label: '📞 Call Store Now', externalUrl: `tel:${CALL_PHONE}` },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ]
          );
          break;
        }

        case 'shipping_info': {
          // Source of Truth: shopInfo.json (Never states an amount for shipping charges)
          const areas = defaultShopInfo.delivery?.areas || 'All around Tamil Nadu';
          const windowHours = defaultShopInfo.delivery?.deliveryWindow || '8 AM to 8 PM';
          const festiveNote = defaultShopInfo.delivery?.festiveNote || 'Delivery timings may vary during festive seasons.';
          const shippingNote = defaultShopInfo.delivery?.shippingChargesNote || 'Shipping charges depend on the delivery area and will be updated soon.';

          addMessage(
            'bot',
            `🚚 Shipping & Delivery Information:\n\n• Delivery Coverage: ${areas}\n• Delivery Window: ${windowHours}\n• Festive Schedule: ${festiveNote}\n• Shipping Charges: ${shippingNote}\n\nPlease chat with us on WhatsApp for a quick shipping quote to your PIN code.`,
            [
              { label: '💬 Get Delivery Quote on WhatsApp', action: 'open_whatsapp_direct' },
              { label: '🛍️ Browse Products', action: 'browse_products' },
              { label: '↩️ Main Menu', action: 'main_menu' }
            ]
          );
          break;
        }

        case 'ask_returns': {
          const ans = answerQuestion('return policy', { products, shopInfo: defaultShopInfo, selectedPhone: selectedNumber });
          addMessage('bot', ans.text, ans.options, null, ans.handOffMessage);
          break;
        }

        case 'ask_delivery': {
          const ans = answerQuestion('delivery areas', { products, shopInfo: defaultShopInfo, selectedPhone: selectedNumber });
          addMessage('bot', ans.text, ans.options, null, ans.handOffMessage);
          break;
        }

        case 'ask_shipping_charges': {
          const ans = answerQuestion('shipping charges', { products, shopInfo: defaultShopInfo, selectedPhone: selectedNumber });
          addMessage('bot', ans.text, ans.options, null, ans.handOffMessage);
          break;
        }

        case 'open_whatsapp_direct': {
          const msg = lastQuery
            ? `Hello Rajamani Textiles, I had a question on your website: "${lastQuery}"`
            : 'Hello Rajamani Textiles Madurai, I am on your website and would like to chat.';
          const waUrl = formatWhatsAppUrl(msg, selectedNumber);
          window.open(waUrl, '_blank', 'noreferrer');
          addMessage('bot', 'Opening WhatsApp chat with Rajamani Textiles. You can continue typing here or tap below:', [
            { label: 'Click to open WhatsApp', externalUrl: waUrl },
            { label: '↩️ Main Menu', action: 'main_menu' }
          ]);
          break;
        }

        case 'main_menu':
        default:
          addMessage(
            'bot',
            'What would you like assistance with?',
            [
              { label: '🛍️ Browse Products & Rates', action: 'browse_products' },
              { label: '👶 Baby Section (Beds, Quick Dry, Gifts)', action: 'baby_beds' },
              { label: '🏢 Wholesale / Bulk Order', action: 'wholesale_info' },
              { label: '📍 Store Address & Timings', action: 'store_info' },
              { label: '🚚 Shipping & Delivery', action: 'shipping_info' },
              { label: '💬 Chat on WhatsApp', action: 'open_whatsapp_direct' }
            ]
          );
          break;
      }
    }, 400);
  }

  function handleUserInput(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    setInputMessage('');
    addMessage('user', text);
    setLastQuery(text);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Process typed question using rule-based Answer Engine
      const result = answerQuestion(text, {
        products,
        shopInfo: defaultShopInfo,
        selectedPhone: selectedNumber
      });

      addMessage(
        'bot',
        result.text,
        result.options,
        result.products && result.products.length > 0 ? result.products : null,
        result.handOffMessage
      );
    }, 450);
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="wa-chatbot-launcher-wrap">
        <button 
          className={`wa-chatbot-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat with Rajamani Textiles"}
          title="Chat on WhatsApp"
        >
          {isOpen ? (
            <X size={26} color="#FFFFFF"/>
          ) : (
            <WhatsAppIcon size={30}/>
          )}
        </button>
      </div>

      {/* WhatsApp Chat Window */}
      {isOpen && (
        <div className="wa-chat-window" role="dialog" aria-label="Rajamani Textiles WhatsApp Chat">
          {/* Header */}
          <div className="wa-chat-header">
            <div className="wa-header-profile">
              <div className="wa-avatar-ring">
                <NandiEmblem size={26}/>
              </div>
              <div className="wa-profile-info">
                <div className="wa-title-row">
                  <strong>RAJAMANI TEXTILES</strong>
                  <span className="wa-verified-badge" title="Verified Store">✓</span>
                </div>
                <span className="wa-status-text">
                  <span className="wa-green-dot"/> Online · Vilakkuthoon, Madurai
                </span>
              </div>
            </div>

            <div className="wa-header-actions">
              <a 
                href={`tel:${CALL_PHONE}`} 
                className="wa-header-icon-btn" 
                title="Call 99445 63827" 
                aria-label="Call Store"
              >
                <Phone size={17}/>
              </a>
              <button 
                onClick={() => setIsOpen(false)} 
                className="wa-header-icon-btn" 
                title="Close chat" 
                aria-label="Close chat"
              >
                <X size={19}/>
              </button>
            </div>
          </div>

          {/* Number Switcher Banner */}
          <div className="wa-number-bar">
            <span>WhatsApp line:</span>
            <button 
              className={selectedNumber === PRIMARY_WA ? 'active' : ''} 
              onClick={() => setSelectedNumber(PRIMARY_WA)}
            >
              86676 86067
            </button>
            <span>·</span>
            <button 
              className={selectedNumber === SECONDARY_WA ? 'active' : ''} 
              onClick={() => setSelectedNumber(SECONDARY_WA)}
            >
              63793 80253
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="wa-messages-body">
            <div className="wa-encrypted-notice">
              🔒 Direct WhatsApp channel with N. Subramanian, Proprietor, Rajamani Textiles.
            </div>

            {messages.map((m) => (
              <div key={m.id} className={`wa-message-row ${m.sender === 'user' ? 'outgoing' : 'incoming'}`}>
                <div className="wa-bubble">
                  {m.sender === 'bot' && (
                    <span className="wa-sender-label">Rajamani Textiles</span>
                  )}
                  <p className="wa-text">{m.text}</p>

                  {/* Up to 3 Product Cards rendered inside the message */}
                  {m.productCards && m.productCards.length > 0 && (
                    <div className="wa-product-cards-list">
                      {m.productCards.map(p => {
                        const stockInfo = getStockStatusText(p.stock);
                        const hasDiscount = p.originalPrice && p.originalPrice > p.price;
                        const discountPct = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
                        const isAdded = addedIds.has(p.id);

                        return (
                          <div key={p.id} className="wa-chat-product-card">
                            <div className="wa-card-image-wrap">
                              <img src={imageSrc(p.image)} alt={p.name} loading="lazy" />
                            </div>
                            <div className="wa-card-details">
                              <Link 
                                to={productUrl(p)} 
                                className="wa-card-title"
                                onClick={() => setIsOpen(false)}
                                title={p.name}
                              >
                                {p.name}
                              </Link>
                              <div className="wa-card-pricing">
                                <span className="wa-card-price">{money(p.price)}</span>
                                {hasDiscount && (
                                  <>
                                    <span className="wa-card-mrp">{money(p.originalPrice)}</span>
                                    <span className="wa-card-discount">{discountPct}% OFF</span>
                                  </>
                                )}
                              </div>
                              <span className={`wa-stock-pill ${p.stock === 'in_stock' ? 'in-stock' : p.stock === 'low' ? 'low-stock' : p.stock === 'out' ? 'out-stock' : 'unknown-stock'}`}>
                                {stockInfo.text}
                              </span>
                              <div className="wa-card-actions">
                                <button 
                                  className="wa-card-add-btn" 
                                  onClick={() => handleAddToCart(p)}
                                  disabled={p.stock === 'out'}
                                >
                                  {isAdded ? <><Check size={11}/> Added</> : <><Plus size={11}/> Add to Bag</>}
                                </button>
                                <Link 
                                  to={productUrl(p)} 
                                  className="wa-card-view-btn"
                                  onClick={() => setIsOpen(false)}
                                >
                                  View
                                </Link>
                                {!stockInfo.isKnown && (
                                  <a 
                                    href={formatWhatsAppUrl(`Hello Rajamani Textiles, is "${p.name}" (₹${p.price}) available in stock?`, selectedNumber)}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="wa-card-wa-btn"
                                  >
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Follow-up Chips / Action Buttons */}
                  {m.options && (
                    <div className="wa-options-grid">
                      {m.options.map((opt, idx) => (
                        opt.externalUrl ? (
                          <a 
                            key={idx} 
                            href={opt.externalUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="wa-chip-btn wa-external"
                          >
                            {opt.label} <ExternalLink size={12}/>
                          </a>
                        ) : (
                          <button 
                            key={idx} 
                            onClick={() => handleQuickAction(opt.action, opt.label)} 
                            className="wa-chip-btn"
                          >
                            {opt.label}
                          </button>
                        )
                      ))}
                    </div>
                  )}

                  <div className="wa-meta">
                    <span className="wa-time">{m.time}</span>
                    {m.sender === 'user' && (
                      <CheckCheck size={14} className="wa-ticks" color="#34B7F1"/>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="wa-message-row incoming">
                <div className="wa-bubble wa-typing-bubble">
                  <span className="wa-typing-dot"/>
                  <span className="wa-typing-dot"/>
                  <span className="wa-typing-dot"/>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* Input Footer */}
          <form className="wa-input-footer" onSubmit={handleUserInput}>
            <input 
              type="text" 
              placeholder="Ask about products, prices, stock, delivery…" 
              value={inputMessage} 
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleUserInput(e);
                }
              }}
              aria-label="Type message to WhatsApp bot"
              maxLength={200}
            />
            <button 
              type="submit" 
              className="wa-send-btn" 
              disabled={!inputMessage.trim()}
              aria-label="Send message"
            >
              <Send size={16}/>
            </button>
          </form>

          {/* Quick Bottom Direct WhatsApp Link (Pre-fills customer's last question) */}
          <div className="wa-direct-banner">
            <WhatsAppIcon size={16}/>
            <span>Or continue on official WhatsApp:</span>
            <a 
              href={formatWhatsAppUrl(
                lastQuery 
                  ? `Hello Rajamani Textiles, I had a question on your website: "${lastQuery}"` 
                  : 'Hello Rajamani Textiles, I am visiting your website and have an inquiry.', 
                selectedNumber
              )}
              target="_blank" 
              rel="noreferrer"
            >
              Chat on WhatsApp <ExternalLink size={11}/>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
