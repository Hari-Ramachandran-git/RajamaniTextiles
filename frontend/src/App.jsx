import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { CataloguePage, NotFoundPage, ProductCard, imageSrc, productUrl, SareePage, StoryPage, NandiEmblem, ALL_CATEGORIES } from './StorePages.jsx';
import { OrderStatusPage } from './OrderStatusPage.jsx';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Heart, Menu, MessageCircle, Minus, Phone, MapPin, Plus, Search, ShieldCheck, ShoppingBag, Truck, X, RefreshCw, Sparkles, Leaf, AlertCircle } from 'lucide-react';
import { products, submitDemoOrder, subscribeDemo } from './mock-store.js';
import { checkPincode, PAYMENT_METHODS, saveOrderToHistory, buildWhatsAppOrderMessage } from './orders.js';
import { addItem, cartTotal, shippingFor } from './cart';
import { Overlay } from './UI.jsx';
import { selectProducts } from './catalogue.js';
import { WhatsAppChatBot } from './WhatsAppChatBot.jsx';

const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
function readSaved(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef(null);
  const scrollPositions = useRef(new Map());
  const previousPath = useRef(location.pathname);

  const [cart, setCart] = useState(() => {
    const data = readSaved('rt-cart', readSaved('oms-cart', []));
    return Array.isArray(data) ? data.filter(x => Number.isInteger(x.id) && Number.isInteger(x.quantity) && x.quantity > 0 && x.quantity <= 20) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const data = readSaved('rt-wishlist', readSaved('oms-wishlist', []));
    return Array.isArray(data) ? data.filter(Number.isInteger) : [];
  });

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [helpTopic, setHelpTopic] = useState(null);
  const [checkoutData, setCheckoutData] = useState({});
  const [email, setEmail] = useState('');
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].name);
  const [orderCopied, setOrderCopied] = useState(false);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const changed = previousPath.current !== location.pathname;
    if (changed || navigationType === 'POP') {
      const top = navigationType === 'POP' ? (scrollPositions.current.get(location.key) || 0) : 0;
      window.scrollTo({ top, behavior: 'instant' });
      if (changed && navigationType !== 'POP') mainRef.current?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.key, location.pathname, navigationType]);

  useEffect(() => {
    const save = () => scrollPositions.current.set(location.key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [location.key]);

  useEffect(() => {
    setMobileNav(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const segments = location.pathname.split('/');
    const id = segments[2];
    const p = products.find(p => String(p.id) === id);
    const title = location.pathname === '/' 
      ? 'Wholesale & Retail Textiles | Madurai'
      : (location.pathname === '/products' || location.pathname === '/sarees')
        ? 'All Textiles & Home Linens'
        : location.pathname === '/wishlist'
          ? 'Your Wishlist'
          : location.pathname === '/our-story'
            ? 'About Our Shop'
            : p?.name || 'Page Not Found';
    document.title = `${title} | RAJAMANI TEXTILES`;
  }, [location.pathname]);

  useEffect(() => {
    try { localStorage.setItem('rt-cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('rt-wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(''), toast?.actionLabel ? 8000 : 5000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  const filtered = useMemo(() => selectProducts(products, { category, sort }), [category, sort]);
  const searchMatches = selectProducts(products, { search });
  const toastMessage = typeof toast === 'string' ? toast : toast?.message;
  const count = cart.reduce((n, x) => n + x.quantity, 0);
  const subtotal = cartTotal(cart, products);
  const shipping = shippingFor(subtotal);

  function goShop(next = 'All', occ = 'All', order = 'featured') {
    const params = new URLSearchParams();
    if (next !== 'All' && next !== 'All Textiles') params.set('category', next);
    if (occ !== 'All') params.set('occasion', occ);
    if (order !== 'featured') params.set('sort', order);
    setMobileNav(false);
    navigate(`/products${params.size ? '?' + params : ''}`);
  }

  function toggleWish(id) {
    const saved = wishlist.includes(id);
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    setToast({
      message: saved ? 'Removed from your wishlist' : 'Saved to your wishlist',
      actionLabel: 'View wishlist',
      onAction: () => { setToast(''); navigate('/wishlist'); }
    });
  }

  function add(p, quantity = 1) {
    const existing = cart.find(x => x.id === p.id)?.quantity || 0;
    const limit = typeof p.stock === 'number' ? p.stock : (p.stock === 'out' ? 0 : (p.stock === 'low' ? 3 : 20));
    if (existing >= limit) {
      setToast(`All available stock of ${p.name} is already in your bag`);
      return;
    }
    setCart(c => addItem(c, p, quantity));
    setToast({
      message: `${p.name} added to your bag`,
      actionLabel: 'View bag',
      onAction: () => { setToast(''); openBag(); }
    });
  }

  function buyNow(p, quantity) {
    setToast('');
    setCart(c => addItem(c, p, quantity));
    setCheckout(true);
    setOrder(null);
    setError('');
    setCartOpen(true);
  }

  function openBag() {
    setToast('');
    setCartOpen(true);
    setCheckout(false);
    setOrder(null);
    setError('');
  }

  function removeItem(id) {
    const line = cart.find(x => x.id === id);
    const p = products.find(p => p.id === id);
    if (!line || !p) return;
    setCart(c => c.filter(x => x.id !== id));
    setToast({
      message: `${p.name} removed`,
      actionLabel: 'Undo',
      onAction: () => {
        setCart(c => addItem(c, p, line.quantity));
        setToast(`${p.name} restored to your bag`);
      }
    });
  }

  function quantity(id, delta) {
    if (delta < 0 && cart.find(x => x.id === id)?.quantity === 1) {
      removeItem(id);
      return;
    }
    setCart(c => c.map(x => x.id === id ? {
      ...x,
      quantity: Math.min((products.find(p => p.id === id)?.stock || 1), x.quantity + delta)
    } : x).filter(x => x.quantity > 0));
  }

  const closeCart = useMemo(() => () => {
    setCartOpen(false);
    setError('');
  }, []);

  async function placeOrder(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const customer = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      address: form.get('address'),
      city: form.get('city'),
      postalCode: form.get('postalCode')
    };
    try {
      const receipt = await submitDemoOrder({
        customer,
        items: cart
      });
      const fullOrder = {
        ...receipt,
        customer,
        paymentMethod: paymentMethod || 'UPI / QR (Google Pay, PhonePe)'
      };
      saveOrderToHistory(fullOrder);
      setOrder(fullOrder);
      setCart([]);
      setCheckout(false);
      setCheckoutData({});
      setToast('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function subscribe(e) {
    e.preventDefault();
    setNewsletterBusy(true);
    try {
      const result = await subscribeDemo(email);
      setToast(result.message);
      setEmail('');
    } catch (err) {
      setToast(err.message);
    } finally {
      setNewsletterBusy(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Top Announcement Bar */}
      <div className="announcement">
        <span className="announcement-left">
          <NandiEmblem size={18}/> <strong>RAJAMANI TEXTILES</strong> · 15, Mahal Vadampokki St, Vilakkuthoon, Madurai - 625001
        </span>
        <span className="announcement-right">
          <Phone size={13}/> <strong>99445 63827</strong> · <MessageCircle size={13}/> WhatsApp: <strong>86676 86067 / 63793 80253</strong>
        </span>
      </div>

      {/* Main Header */}
      <header>
        <div className="header-main">
          <button className="icon mobile-menu" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={mobileNav} onClick={()=>setMobileNav(true)}>
            <Menu/>
          </button>

          <Link className="wordmark" to="/" aria-label="Rajamani Textiles Madurai Home">
            <NandiEmblem size={46}/>
            <div className="wordmark-text">
              <span className="brand-name">RAJAMANI</span>
              <span className="brand-sub">T E X T I L E S</span>
            </div>
          </Link>

          <div className="header-note">
            <strong>Wholesale &amp; Retail Hub</strong><br/>
            <span>Bedsheets · Towels · Pillows · Beds · Shawls</span>
          </div>

          <div className="header-actions">
            <a 
              className="header-whatsapp-pill" 
              href="https://wa.me/918667686067?text=Hello%20Rajamani%20Textiles!%20I%20would%20like%20to%20enquire%20about%20your%20textiles." 
              target="_blank" 
              rel="noreferrer" 
              title="Chat on WhatsApp"
            >
              <MessageCircle size={16}/> <span>Chat</span>
            </a>

            <button className="icon" aria-label="Search textiles" aria-haspopup="dialog" onClick={()=>{setSearch('');setSearchOpen(true);}}>
              <Search/>
            </button>

            <Link 
              to="/order-status" 
              className={`icon header-track-link ${location.pathname.startsWith('/order') ? 'active' : ''}`} 
              aria-label="Track Order Status"
              title="Track Your Order"
            >
              <Truck size={20}/>
            </Link>

            <button className={`icon ${location.pathname==='/wishlist'?'active':''}`} aria-label={`Wishlist, ${wishlist.length} items`} onClick={()=>navigate('/wishlist')}>
              <Heart/>
              {wishlist.length > 0 && <i>{wishlist.length}</i>}
            </button>

            <button className="icon bag-button" aria-label={`Shopping bag, ${count} items`} onClick={openBag}>
              <ShoppingBag/>
              <i>{count}</i>
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar */}
        <nav className="nav" aria-label="Main navigation">
          <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Home</Link>
          <Link to="/products" aria-current={(location.pathname === '/products' || location.pathname === '/sarees') && !location.search ? 'page' : undefined}>All Textiles</Link>
          <Link to="/products?category=Bedsheets" aria-current={location.search.includes('Bedsheets') ? 'page' : undefined}>Bedsheets</Link>
          <Link to="/products?category=Towels" aria-current={location.search.includes('Towels') ? 'page' : undefined}>Towels</Link>
          <Link to="/products?category=Pillows" aria-current={location.search.includes('Pillows') ? 'page' : undefined}>Pillows</Link>
          <Link to="/products?category=Beds" aria-current={location.search.includes('category=Beds') ? 'page' : undefined}>Beds</Link>
          <Link to="/products?category=Baby" aria-current={location.search.includes('category=Baby') ? 'page' : undefined}>Baby Section</Link>
          <Link to="/products?category=Function+Shawls" aria-current={location.search.includes('Function+Shawls') ? 'page' : undefined}>Function Shawls</Link>
          <Link to="/products?category=Door+and+Window+Screens" aria-current={location.search.includes('Screens') ? 'page' : undefined}>Screens &amp; Curtains</Link>
          <Link to="/our-story" aria-current={location.pathname === '/our-story' ? 'page' : undefined}>About Shop</Link>
        </nav>
      </header>

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<>
            {/* Hero Section */}
            <section className="hero">
              <img className="hero-image" src="/images/hero-textiles.jpg" alt="Rajamani Textiles Madurai Home Linens"/>
              <div className="hero-shade"/>
              <div className="hero-pattern-bg"/>
              <div className="hero-content">
                <div className="eyebrow">
                  <NandiEmblem size={22}/> MADURAI'S TEXTILE DESTINATION · WHOLESALE &amp; RETAIL
                </div>
                <h1>
                  Bedsheets, Towels, Pillows &amp; Beds.<br/>
                  <em>Woven with Madurai Quality.</em>
                </h1>
                <p>
                  Discover pure cotton bedsheets, authentic Ilavam Panju beds &amp; pillows, 
                  quick-dry bath towels, newborn baby bedding, ceremonial function shawls, 
                  innerwear, and elegant door &amp; window screens.
                </p>
                <div className="hero-cta-group">
                  <button className="primary" onClick={()=>goShop()}>
                    EXPLORE ALL TEXTILES <ArrowRight size={17}/>
                  </button>
                  <a className="hero-contact-btn" href="#store-spotlight">
                    VIEW STORE LOCATION &amp; CONTACT <ArrowDownRight size={16}/>
                  </a>
                </div>
                <div className="hero-caption">
                  <span className="tiny-lotus">✦</span> Vilakkuthoon, Madurai · Wholesale &amp; Retail Destination
                </div>
              </div>
              <div className="hero-edition">
                RAJAMANI TEXTILES <span>VILAKKUTHOON · MADURAI</span>
              </div>
            </section>

            {/* Store Benefits */}
            <section className="benefits" aria-label="Store benefits">
              <div>
                <Truck/>
                <p>Wholesale &amp; Retail<span>Direct loom prices for all</span></p>
              </div>
              <div>
                <ShieldCheck/>
                <p>100% Genuine Cotton<span>Pure Ilavam Panju &amp; fine fabrics</span></p>
              </div>
              <div>
                <MapPin/>
                <p>Vilakkuthoon, Madurai<span>Heart of South Indian handlooms</span></p>
              </div>
              <div>
                <MessageCircle/>
                <p>WhatsApp &amp; Phone Orders<span>Call 99445 63827 for quick help</span></p>
              </div>
            </section>

            {/* All 10 Product Categories - Visual Grid */}
            <section className="occasions section-wrap">
              <div className="section-heading">
                <div className="eyebrow">SHOP BY CATEGORY</div>
                <h2>Everything for Your Home &amp; Ceremonies</h2>
                <p>Explore our complete range of high-quality household and function textiles:</p>
              </div>

              <div className="category-showcase-grid">
                {[
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Bedsheets', label: 'Bedsheets', image: 'category-bedsheets.webp', alt: 'Folded pure cotton bedsheets stack, Rajamani Textiles', sub: 'Single, Double & King 100% Pure Cotton' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Towels', label: 'Towels', image: 'category-towels.webp', alt: 'Rolled and folded plush cotton towels in a basket, Rajamani Textiles', sub: 'Madurai Waffle & Plush Turkish Bath Towels' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Pillows', label: 'Pillows', image: 'category-pillows.webp', alt: 'Fluffy white and cream cotton sleeping pillows on a bed, Rajamani Textiles', sub: 'Pure Ilavam Panju Silk Cotton & Microfiber' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Beds', label: 'Beds & Mattresses', image: 'category-beds-mattresses.webp', alt: 'Handcrafted cotton Ilavam Panju mattress on a wooden cot, Rajamani Textiles', sub: 'Hand-Tufted Silk Cotton & Travel Beds' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Baby', label: 'Baby Section', image: 'category-baby-section.webp', alt: 'Baby sleeping bed set with protective mosquito net, Rajamani Textiles', sub: 'Travel Beds, Quick Dry Mats, Gift Sets & Umbrella Nets' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Function Shawls', label: 'Function Shawls', image: 'category-function-shawls.webp', alt: 'Folded ceremonial silk-cotton Ponnada shawl with gold zari border, Rajamani Textiles', sub: 'Royal Gold Zari Ponnadas & Wedding Shawls' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Inner Wears', label: 'Inner Wears', image: 'category-inner-wears.webp', alt: 'Folded cotton innerwear, Rajamani Textiles', sub: '100% Super Combed Cotton Vests & Trunks' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Door and Window Screens', label: 'Door & Window Screens', image: 'category-screens.webp', alt: 'Woven cotton door and window curtains hanging at a window, Rajamani Textiles', sub: '7ft & 5ft Woven Jacquard Eyelet Curtains' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Bed Spread', label: 'Bed Spreads', image: 'category-bed-spread.webp', alt: 'Block-printed cotton bedspread laid flat on a bed, Rajamani Textiles', sub: 'Heavy Madurai Handloom Spreads & Chenille' },
                  // TODO: replace with a photo of the shop's actual stock
                  { name: 'Bedcover', label: 'Bed Covers', image: 'category-bedcovers.webp', alt: 'Quilted cotton bedcover folded at the foot of a bed, Rajamani Textiles', sub: 'Reversible Quilted & Waterproof Fitted' }
                ].map(item => (
                  <button className="category-browse-card" key={item.name} onClick={()=>goShop(item.name)}>
                    <div className="category-card-image">
                      <img src={`/images/${item.image}`} alt={item.alt} loading="lazy"/>
                      <span className="card-arrow"><ArrowUpRight size={18}/></span>
                    </div>
                    <h3>{item.label}</h3>
                    <p>{item.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Store Information & Spotlight Section */}
            <section id="store-spotlight" className="store-spotlight section-wrap">
              <div className="card-spotlight-inner">
                <div className="store-badge-card">
                  <div className="store-badge-inner">
                    <NandiEmblem size={88}/>
                    <h3>RAJAMANI TEXTILES</h3>
                    <p className="badge-subtitle">ESTABLISHED TEXTILE DESTINATION</p>
                    <div className="badge-divider"/>
                    <div className="badge-details">
                      <span><MapPin size={15}/> 15, Mahal Vadampokki Street</span>
                      <span>Vilakkuthoon, Madurai - 625001</span>
                    </div>
                    <div className="badge-footer">
                      <span><ShieldCheck size={16}/> Direct Loom Quality · Wholesale &amp; Retail</span>
                    </div>
                  </div>
                </div>

                <div className="card-spotlight-content">
                  <div className="card-badge">
                    <NandiEmblem size={30}/>
                    <span>ESTABLISHED TEXTILE SHOP · MADURAI</span>
                  </div>
                  <h2>RAJAMANI TEXTILES</h2>
                  <p className="shop-proprietor">Proprietor: <strong>N. Subramanian</strong></p>
                  
                  <div className="contact-points-list">
                    <div className="contact-point">
                      <Phone size={18} className="c-icon"/>
                      <div>
                        <span className="label">Call For Orders:</span>
                        <a href="tel:9944563827" className="val">99445 63827</a>
                      </div>
                    </div>

                    <div className="contact-point">
                      <MessageCircle size={18} className="c-icon wa"/>
                      <div>
                        <span className="label">WhatsApp Enquiries:</span>
                        <span className="val">
                          <a href="https://wa.me/918667686067" target="_blank" rel="noreferrer">86676 86067</a>
                          {' / '}
                          <a href="https://wa.me/916379380253" target="_blank" rel="noreferrer">63793 80253</a>
                        </span>
                      </div>
                    </div>

                    <div className="contact-point">
                      <MapPin size={18} className="c-icon"/>
                      <div>
                        <span className="label">Store Address:</span>
                        <p className="val addr">15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001.</p>
                      </div>
                    </div>

                    <div className="contact-point">
                      <ShieldCheck size={18} className="c-icon"/>
                      <div>
                        <span className="label">Store Verification:</span>
                        <span className="val">Government Registered Store · GSTIN in Footer</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <a className="primary-pill" href="tel:9944563827">
                      <Phone size={16}/> Call Shop Now
                    </a>
                    <a className="whatsapp-pill" href="https://wa.me/918667686067" target="_blank" rel="noreferrer">
                      <MessageCircle size={16}/> WhatsApp 86676 86067
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Product Collection */}
            <section id="collection" className="collection section-wrap">
              <div className="collection-title">
                <div>
                  <div className="eyebrow">OUR CURATED SELECTION</div>
                  <h2>Popular Textiles &amp; Home Essentials</h2>
                </div>
                <Link to="/products">Discover all products <ArrowRight size={17}/></Link>
              </div>

              <div className="collection-controls">
                <div className="tabs" role="group" aria-label="Filter by category">
                  {['All', 'Bedsheets', 'Towels', 'Baby', 'Pillows', 'Function Shawls', 'Bedcover'].map(c => (
                    <button key={c} className={category === c ? 'selected' : ''} onClick={()=>setCategory(c)}>
                      {c === 'All' ? 'All Items' : c}
                    </button>
                  ))}
                </div>
                <label className="sort-label">Sort by 
                  <select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                  </select>
                </label>
              </div>

              <div className="product-grid">
                {filtered.slice(0, 8).map(p => (
                  <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWish={toggleWish} add={add}/>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="empty">
                  <Heart/>
                  <h3>No textiles found.</h3>
                  <p>Try another category or browse all textiles.</p>
                  <button className="primary" onClick={()=>goShop()}>EXPLORE ALL <ArrowRight size={16}/></button>
                </div>
              )}

              <div className="collection-bottom">
                <span>Direct wholesale and retail pricing. Quality trusted across Madurai.</span>
                <button className="outline" onClick={()=>goShop()}>VIEW FULL CATALOGUE <ArrowRight size={16}/></button>
              </div>
            </section>

            {/* About Store Strip */}
            <section id="our-story" className="story section-wrap">
              <div className="story-image">
                <img src="/images/bedspread-jacquard-handloom.jpg" alt="Traditional Madurai Handloom Bedspread" loading="lazy"/>
                <span className="story-image-label">MADURAI WEAVING TRADITION</span>
              </div>
              <div className="story-content">
                <NandiEmblem size={44}/>
                <div className="eyebrow">ABOUT RAJAMANI TEXTILES</div>
                <h2>A Name You Can Trust.<br/><em>Tradition in Every Thread.</em></h2>
                <p>
                  Operating in Vilakkuthoon — Madurai’s storied epicentre for handlooms, pure cotton weaves, and textile commerce — 
                  <strong>RAJAMANI TEXTILES</strong> provides premier home textiles for families, weddings, and commercial needs.
                </p>
                <p>
                  We are deeply committed to providing uncompromised fabric quality, genuine Kapok (Ilavam Panju) bedding, 
                  lasting dyes, and transparent wholesale rates.
                </p>
                <div className="story-values">
                  <span><Leaf size={18}/> 100% Pure Cotton</span>
                  <span><Sparkles size={18}/> Direct Loom Prices</span>
                </div>
                <button className="story-link" onClick={()=>navigate('/our-story')}>
                  READ OUR FULL STORY &amp; CONTACT DETAILS <ArrowRight size={18}/>
                </button>
              </div>
            </section>

            {/* Customer Quote */}
            <section className="quote">
              <div className="eyebrow">MADURAI'S TEXTILE TRUST</div>
              <div className="stars">★★★★★</div>
              <blockquote>
                “Rajamani Textiles in Vilakkuthoon is our first stop for pure cotton bedsheets, 
                cooling Ilavam Panju pillows, and ceremonial function shawls. 
                Honest prices and exceptional quality.”
              </blockquote>
              <span>Loved by retail shoppers and wholesale buyers alike.</span>
            </section>
          </>}/>

          {/* Product Catalogue Routes */}
          <Route path="/products" element={<CataloguePage products={products} wishlist={wishlist} toggleWish={toggleWish} add={add}/>}/>
          <Route path="/products/:id/:slug?" element={<SareePage products={products} wishlist={wishlist} toggleWish={toggleWish} add={add} cart={cart} buyNow={buyNow}/>}/>
          
          {/* Legacy / Saree Aliases so old bookmarks or tests continue to work */}
          <Route path="/sarees" element={<CataloguePage products={products} wishlist={wishlist} toggleWish={toggleWish} add={add}/>}/>
          <Route path="/sarees/:id/:slug?" element={<SareePage products={products} wishlist={wishlist} toggleWish={toggleWish} add={add} cart={cart} buyNow={buyNow}/>}/>

          <Route path="/wishlist" element={<CataloguePage products={products} wishlist={wishlist} toggleWish={toggleWish} add={add} wishlistOnly/>}/>
          <Route path="/order/:orderId" element={<OrderStatusPage products={products}/>}/>
          <Route path="/order-status" element={<OrderStatusPage products={products}/>}/>
          <Route path="/orders/:orderId" element={<OrderStatusPage products={products}/>}/>
          <Route path="/our-story" element={<StoryPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>

        {/* Newsletter Section */}
        <section className="newsletter">
          <div>
            <div className="eyebrow">STAY CONNECTED WITH RAJAMANI TEXTILES</div>
            <h2>New arrivals, seasonal offers &amp; wholesale updates.</h2>
            <p>Get notified about new bedsheet collections, festive shawls, and stock updates.</p>
          </div>
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
            <input 
              id="newsletter-email" 
              type="email" 
              placeholder="Your email address" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
              maxLength={254}
            />
            <button disabled={newsletterBusy} aria-label="Subscribe to newsletter">
              {newsletterBusy ? '…' : <ArrowRight size={23}/>}
            </button>
          </form>
        </section>
      </main>

      {/* Main Footer */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="wordmark">
              <NandiEmblem size={44}/>
              <div className="wordmark-text">
                <span className="brand-name">RAJAMANI</span>
                <span className="brand-sub">T E X T I L E S</span>
              </div>
            </Link>
            <p>
              15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001.<br/>
              <strong>Proprietor:</strong> N. Subramanian<br/>
              <strong>GSTIN:</strong> 33**********1Z0
            </p>
            <div className="footer-phone-list">
              <span><Phone size={13}/> Call: <strong>99445 63827</strong></span><br/>
              <span><MessageCircle size={13}/> WhatsApp: <strong>86676 86067 / 63793 80253</strong></span>
            </div>
          </div>

          <div>
            <h4>Product Categories</h4>
            <button onClick={()=>goShop('Bedsheets')}>Bedsheets (Single, Double, King)</button>
            <button onClick={()=>goShop('Towels')}>Bath &amp; Hand Towels</button>
            <button onClick={()=>goShop('Pillows')}>Ilavam Panju &amp; Microfiber Pillows</button>
            <button onClick={()=>goShop('Beds')}>Handcrafted Cotton Mattresses</button>
            <button onClick={()=>goShop('Baby')}>Baby Section (Beds, Quick Dry, Gifts)</button>
            <button onClick={()=>goShop('Function Shawls')}>Ceremonial Function Shawls</button>
            <button onClick={()=>goShop('Door and Window Screens')}>Curtains &amp; Window Screens</button>
          </div>

          <div>
            <h4>Customer Support</h4>
            <Link to="/order-status" style={{ display: 'block', textAlign: 'left', padding: '6px 0', fontSize: '12px', color: 'inherit' }}>
              Track Your Order &amp; Delivery
            </Link>
            <button onClick={()=>setHelpTopic('shipping')}>Shipping &amp; Delivery</button>
            <button onClick={()=>setHelpTopic('wholesale')}>Wholesale &amp; Bulk Enquiries</button>
            <button onClick={()=>setHelpTopic('care')}>Textile Wash &amp; Care Guide</button>
            <button onClick={()=>setHelpTopic('visiting')}>Store Visit &amp; Location</button>
          </div>

          <div className="footer-note">
            <h4>Madurai Textile Heritage</h4>
            <p>Wholesale &amp; Retail Specialists.<br/>Direct Loom Value.<br/>Always, Rajamani Textiles.</p>
            <span className="demo-label">GENUINE TEXTILE STORE · ONLINE DEMO</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RAJAMANI TEXTILES, MADURAI. All rights reserved.</span>
          <span>15, Mahal Vadampokki Street, Vilakkuthoon · GSTIN: 33**********1Z0</span>
          <span className="api-status"><i className="online"/>Direct Phone &amp; WhatsApp Enabled</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && !cartOpen && (
        <div className="toast" role="status">
          <Check size={18}/>
          <span>{toastMessage}</span>
          {toast.actionLabel && <button className="toast-action" onClick={toast.onAction}>{toast.actionLabel}</button>}
          <button aria-label="Dismiss notification" onClick={()=>setToast('')}><X size={16}/></button>
        </div>
      )}

      {/* Search Overlay Dialog */}
      {searchOpen && (
        <Overlay title="Search catalogue" close={()=>setSearchOpen(false)} className="search-dialog">
          <div className="eyebrow">RAJAMANI TEXTILES · MADURAI</div>
          <h2>Search Products &amp; Fabrics</h2>
          <form className="search-input-row" onSubmit={e=>{
            e.preventDefault();
            navigate(`/products${search.trim() ? '?search=' + encodeURIComponent(search.trim()) : ''}`);
            setSearchOpen(false);
          }}>
            <Search size={22}/>
            <input 
              data-autofocus 
              placeholder="Search bedsheets, towels, pillows, beds, shawls, curtains…" 
              aria-label="Search catalogue" 
              value={search} 
              onChange={e=>setSearch(e.target.value)}
            />
            {search && <button type="button" className="icon" aria-label="Clear search" onClick={()=>setSearch('')}><X size={18}/></button>}
            <button className="primary" type="submit" aria-label="Search all products"><ArrowRight size={19}/></button>
          </form>

          {!search.trim() && (
            <div className="popular-searches">
              <span>POPULAR CATEGORIES</span>
              {['Bedsheets', 'Towels', 'Pillows', 'Function Shawls', 'Baby'].map(c => (
                <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} onClick={()=>setSearchOpen(false)}>
                  {c} <ArrowUpRight size={13}/>
                </Link>
              ))}
            </div>
          )}

          <div className="search-results-heading" role="status">
            {search.trim() ? `${searchMatches.length} ${searchMatches.length === 1 ? 'match' : 'matches'} for “${search.trim()}”` : 'Popular items to start with'}
          </div>

          <div className="search-suggestions">
            {searchMatches.slice(0, 4).map(p => (
              <Link key={p.id} to={productUrl(p)} onClick={()=>setSearchOpen(false)}>
                <img src={imageSrc(p.image)} alt="" style={{objectPosition: p.imagePosition}}/>
                <div>
                  <span>{p.category} · {p.color}</span>
                  <h3>{p.name}</h3>
                  <strong>{money(p.price)}</strong>
                </div>
                <ArrowUpRight size={18}/>
              </Link>
            ))}
          </div>

          {searchMatches.length === 0 && (
            <div className="search-empty">
              <h3>No matches found.</h3>
              <p>Try searching for “cotton”, “towel”, “pillow”, “shawl”, or explore all textiles.</p>
            </div>
          )}

          <Link 
            className="search-view-all" 
            to={searchMatches.length && search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : '/products'} 
            onClick={()=>setSearchOpen(false)}
          >
            {search.trim() && searchMatches.length ? `View all ${searchMatches.length} matches` : 'Explore full collection'} <ArrowRight size={17}/>
          </Link>
        </Overlay>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileNav && (
        <Overlay title="Browse textiles" close={()=>setMobileNav(false)} drawer className="mobile-navigation">
          <div className="eyebrow">RAJAMANI TEXTILES · MADURAI</div>
          <h2>Find Your Next Favourite.</h2>
          <nav aria-label="Mobile navigation">
            {[
              ['/', 'Home'],
              ['/products', 'All Textiles Catalogue'],
              ['/products?category=Bedsheets', 'Bedsheets (Single & Double)'],
              ['/products?category=Towels', 'Towels & Bath Linens'],
              ['/products?category=Pillows', 'Ilavam Panju & Pillows'],
              ['/products?category=Beds', 'Beds & Hand-Tufted Mattresses'],
              ['/products?category=Baby', 'Baby Section (Beds, Quick Dry, Gifts)'],
              ['/products?category=Function+Shawls', 'Function Shawls (Ponnada)'],
              ['/products?category=Door+and+Window+Screens', 'Door & Window Screens'],
              ['/order-status', 'Track Your Order & Status'],
              ['/wishlist', 'Your Saved Wishlist'],
              ['/our-story', 'About Shop & Heritage']
            ].map(([url, label]) => (
              <Link key={url} to={url} onClick={()=>setMobileNav(false)}>
                {label} <ArrowUpRight size={19}/>
              </Link>
            ))}
          </nav>

          <div className="mobile-nav-collections">
            <span className="eyebrow">DIRECT CONTACT</span>
            <div className="mobile-contact-box">
              <p><strong>N. Subramanian</strong></p>
              <p>15, Mahal Vadampokki St, Vilakkuthoon, Madurai - 625001</p>
              <p>Call: <a href="tel:9944563827">99445 63827</a></p>
              <p>WhatsApp: <a href="https://wa.me/918667686067">86676 86067</a></p>
            </div>
          </div>

          <div className="mobile-nav-note">
            <Truck size={20}/>
            <p>Wholesale &amp; Retail Pricing<br/><span>Complimentary shipping on orders of ₹1,999 and above</span></p>
          </div>
        </Overlay>
      )}

      {/* Help Topics Overlay */}
      {helpTopic && (
        <Overlay 
          title={{
            shipping: 'Shipping & Delivery',
            wholesale: 'Wholesale & Bulk Orders',
            care: 'Textile Care Guide',
            visiting: 'Store Visit & Address'
          }[helpTopic]} 
          close={()=>setHelpTopic(null)} 
          className="help-dialog"
        >
          <div className="eyebrow">RAJAMANI TEXTILES HELP</div>
          <h2>
            {{
              shipping: 'Delivery Information',
              wholesale: 'Wholesale Pricing & Bulk Inquiries',
              care: 'How to Care for Your Textiles',
              visiting: 'Visit Our Madurai Store'
            }[helpTopic]}
          </h2>

          {helpTopic === 'shipping' ? (
            <>
              <h3>Delivery &amp; Courier</h3>
              <p>We ship retail and wholesale parcels across Tamil Nadu and India. Complimentary shipping is provided on orders of ₹1,999 and above. Standard delivery takes 2–5 business days.</p>
              <h3>Safe Packaging</h3>
              <p>All bedsheets, mattresses, baby bedding, and shawls are hygienically sealed in waterproof moisture-proof bags.</p>
            </>
          ) : helpTopic === 'wholesale' ? (
            <>
              <h3>Wholesale Rates</h3>
              <p>We supply bulk bedsheets, towels, pillows, mattresses, and function shawls to hotels, hospitals, marriage functions, and shops.</p>
              <h3>Contact for Price Quote</h3>
              <p>Directly contact <strong>Mr. N. Subramanian</strong> at <strong>99445 63827</strong> or WhatsApp <strong>86676 86067 / 63793 80253</strong> with your quantity requirement.</p>
            </>
          ) : helpTopic === 'care' ? (
            <>
              <h3>Pure Cotton Bedsheets &amp; Towels</h3>
              <p>Machine or hand wash with mild detergents. Dry waffle towels and cotton bedsheets in shade to preserve vibrant colors.</p>
              <h3>Ilavam Panju (Silk Cotton) Care</h3>
              <p>Do not soak silk cotton mattresses or pillows in water. Air them in warm sunshine once a month to retain fluffy bounce and natural hygiene.</p>
            </>
          ) : (
            <>
              <h3>Store Location</h3>
              <p><strong>15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001.</strong></p>
              <p>Located near the world-famous Thirumalai Nayakkar Mahal and Vilakkuthoon handloom market.</p>
              <p>GST Registration: <strong>33**********1Z0 (Verified)</strong></p>
            </>
          )}

          <button className="outline" onClick={()=>setHelpTopic(null)}>GOT IT <Check size={16}/></button>
        </Overlay>
      )}

      {/* Shopping Bag & Checkout Drawer */}
      {cartOpen && (
        <Overlay title={order ? 'Demo order confirmation' : checkout ? 'Demo checkout' : 'Your shopping bag'} close={closeCart} drawer>
          <div className="drawer-title">
            <div className="eyebrow">RAJAMANI TEXTILES</div>
            <h2>
              {order ? 'Thank you for your order.' : checkout ? 'Demo checkout' : 'Your shopping bag'} {!checkout && !order && <span>({count})</span>}
            </h2>
          </div>

          {toast && (
            <div className="undo-banner" role="status">
              <span>{toastMessage}</span>
              {toast.actionLabel && <button onClick={toast.onAction}>{toast.actionLabel}</button>}
            </div>
          )}

          {order ? (
            <div className="order-success-card">
              <div className="success-mark"><Check size={32}/></div>
              <h3>Your Order is Confirmed!</h3>
              <p>Thank you for choosing Rajamani Textiles.</p>
              
              <div className="order-id-highlight">
                <div>
                  <span>Order Reference</span>
                  <strong>{order.id}</strong>
                </div>
                <button 
                  type="button" 
                  className="copy-chip" 
                  onClick={() => {
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText(order.id);
                      setOrderCopied(true);
                      setTimeout(() => setOrderCopied(false), 2000);
                    }
                  }}
                >
                  {orderCopied ? <Check size={13}/> : <Copy size={13}/>}
                  {orderCopied ? 'Copied' : 'Copy ID'}
                </button>
              </div>

              <div className="confirmation-meta">
                <p><strong>Total:</strong> {money(order.total)}</p>
                <p><strong>Payment Mode:</strong> {order.paymentMethod || 'UPI / Cash on Delivery'}</p>
                <p>
                  <strong>Delivery Estimate:</strong> {order.customer?.postalCode && checkPincode(order.customer.postalCode).region === 'Tamil Nadu' 
                    ? '8 AM to 8 PM Delivery Window (Tamil Nadu Priority)' 
                    : 'Interstate Express Courier (3–5 Days)'}
                </p>
                {order.customer?.address && (
                  <p><strong>Deliver to:</strong> {order.customer.name}, {order.customer.city} ({order.customer.postalCode})</p>
                )}
              </div>

              <div className="order-success-actions">
                <button 
                  className="primary track-order-action" 
                  onClick={() => {
                    closeCart();
                    navigate(`/order/${encodeURIComponent(order.id)}`);
                  }}
                >
                  TRACK LIVE ORDER STATUS <ArrowRight size={16}/>
                </button>

                <a 
                  href={`https://wa.me/918667686067?text=${buildWhatsAppOrderMessage(order)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="order-wa-pill"
                >
                  <MessageCircle size={16}/> CONFIRM VIA WHATSAPP
                </a>

                <button className="text-button" onClick={closeCart}>
                  Continue Exploring Textiles
                </button>
              </div>
            </div>
          ) : checkout ? (
            <>
              <button className="text-button back" onClick={()=>setCheckout(false)}>← Back to bag</button>
              <p className="checkout-note">Enter your delivery address and contact details to confirm your order.</p>
              <div className="checkout-steps">
                <span><Check size={13}/> 1 · Bag Review</span>
                <span className="current">2 · Delivery &amp; PIN Check</span>
                <span>3 · Confirmation</span>
              </div>
              <form className="checkout-form" onSubmit={placeOrder} onChange={e=>{
                if (e.target.name) setCheckoutData(d=>({...d, [e.target.name]: e.target.value}));
              }}>
                <label>
                  Full name
                  <input name="name" defaultValue={checkoutData.name||''} autoComplete="name" minLength={2} maxLength={100} placeholder="e.g. R. Subramanian" required/>
                </label>
                <label>
                  Phone number (10-digit mobile)
                  <input name="phone" defaultValue={checkoutData.phone||''} type="tel" inputMode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit phone number" autoComplete="tel-national" maxLength={10} placeholder="9876543210" required/>
                </label>
                <label>
                  Email address
                  <input name="email" defaultValue={checkoutData.email||''} type="email" autoComplete="email" maxLength={254} placeholder="name@example.com" required/>
                </label>
                <label>
                  Delivery address
                  <textarea name="address" defaultValue={checkoutData.address||''} autoComplete="street-address" minLength={5} maxLength={300} placeholder="Door No, Street Name, Landmark" required/>
                </label>
                <div className="form-row">
                  <label>
                    City / Town
                    <input name="city" defaultValue={checkoutData.city||''} autoComplete="address-level2" maxLength={100} placeholder="e.g. Madurai, Chennai" required/>
                  </label>
                  <label>
                    PIN code
                    <input 
                      name="postalCode" 
                      defaultValue={checkoutData.postalCode||''} 
                      inputMode="numeric" 
                      pattern="[1-9][0-9]{5}" 
                      title="Enter a valid 6-digit Indian PIN code" 
                      maxLength={6} 
                      autoComplete="postal-code" 
                      placeholder="625001" 
                      required
                    />
                  </label>
                </div>

                {/* Real-time PIN code verification feedback */}
                {checkoutData.postalCode && (() => {
                  const pinCheck = checkPincode(checkoutData.postalCode);
                  if (pinCheck.valid) {
                    return (
                      <div className={`pincode-feedback ${pinCheck.region === 'Tamil Nadu' ? 'tn-success' : 'all-india-info'}`}>
                        <Check size={14}/>
                        <span><strong>{pinCheck.badge}:</strong> {pinCheck.message}</span>
                      </div>
                    );
                  }
                  if (checkoutData.postalCode.length === 6) {
                    return (
                      <div className="pincode-feedback pin-error">
                        <AlertCircle size={14}/>
                        <span>{pinCheck.message}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Payment Method Selector */}
                <div className="payment-method-section">
                  <span className="section-label">Select Payment Method</span>
                  <div className="payment-options-grid">
                    {PAYMENT_METHODS.map(method => (
                      <label 
                        key={method.id} 
                        className={`payment-option-card ${paymentMethod === method.name ? 'selected' : ''}`}
                      >
                        <input 
                          type="radio" 
                          name="paymentModeRadio" 
                          value={method.name} 
                          checked={paymentMethod === method.name} 
                          onChange={() => setPaymentMethod(method.name)}
                        />
                        <div className="payment-option-text">
                          <strong>{method.name}</strong>
                          <span>{method.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="checkout-mini-summary">
                  {cart.map(line => {
                    const p = products.find(p => p.id === line.id);
                    return p ? (
                      <div key={p.id}>
                        <span>{p.name} × {line.quantity}</span>
                        <strong>{money(p.price * line.quantity)}</strong>
                      </div>
                    ) : null;
                  })}
                  <div>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Complimentary' : money(shipping)}</span>
                  </div>
                </div>

                <div className="checkout-total">
                  <span>Total (including shipping)</span>
                  <strong>{money(subtotal + shipping)}</strong>
                </div>

                {error && <p className="error" role="alert">{error}</p>}

                <button className="primary" disabled={submitting || cart.length === 0}>
                  {submitting ? 'CONFIRMING ORDER…' : 'CONFIRM & PLACE ORDER'} <ArrowRight size={17}/>
                </button>
              </form>
            </>
          ) : cart.length === 0 ? (
            <div className="empty bag-empty">
              <ShoppingBag size={42}/>
              <h3>Your shopping bag is empty.</h3>
              <p>Explore bedsheets, towels, pillows, beds, shawls, and curtains to add items.</p>
              <button className="primary" onClick={()=>{closeCart(); goShop();}}>
                EXPLORE CATALOGUE <ArrowRight size={16}/>
              </button>
            </div>
          ) : (
            <>
              <div className="bag-free-shipping-progress">
                <div className="progress-info">
                  <Truck size={16}/>
                  <span>
                    {shipping === 0 
                      ? 'Complimentary delivery unlocked across Tamil Nadu!' 
                      : `Add ${money(1999 - subtotal)} for complimentary delivery across Tamil Nadu.`}
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min(100, Math.round((subtotal / 1999) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="cart-lines">
                {cart.map(line => {
                  const p = products.find(p => p.id === line.id);
                  if (!p) return null;
                  return (
                    <div className="cart-line" key={line.id}>
                      <img src={imageSrc(p.image)} alt={p.name} style={{objectPosition: p.imagePosition}}/>
                      <div>
                        <span className="eyebrow">{p.category}</span>
                        <Link to={productUrl(p)} onClick={closeCart}>
                          <h3>{p.name}</h3>
                        </Link>
                        <p>{money(p.price)} · <strong>Total: {money(p.price * line.quantity)}</strong></p>
                        <div className="quantity">
                          <button aria-label={`Decrease ${p.name} quantity`} onClick={()=>quantity(p.id, -1)}>
                            <Minus size={13}/>
                          </button>
                          <span>{line.quantity}</span>
                          <button disabled={line.quantity >= (typeof p.stock === 'number' ? p.stock : (p.stock === 'out' ? 0 : 20))} aria-label={`Increase ${p.name} quantity`} onClick={()=>quantity(p.id, 1)}>
                            <Plus size={13}/>
                          </button>
                        </div>
                      </div>
                      <button className="icon remove" aria-label={`Remove ${p.name} from bag`} onClick={()=>removeItem(p.id)}>
                        <X size={17}/>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bag-summary">
                <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : money(shipping)}</span></div>
                <div className="bag-total"><strong>Total</strong><strong>{money(subtotal + shipping)}</strong></div>
                <button className="primary" onClick={()=>{setToast(''); setCheckout(true); setError('');}}>
                  PROCEED TO CHECKOUT <ArrowRight size={16}/>
                </button>
                <small><ShieldCheck size={14}/> Wholesale &amp; Retail Trusted · Rajamani Textiles</small>
              </div>
            </>
          )}
        </Overlay>
      )}

      {/* Floating Interactive WhatsApp ChatBot */}
      <WhatsAppChatBot products={products} goShop={goShop} add={add}/>
    </>
  );
}

function ArrowDownRight({ size = 16, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="7" x2="17" y2="17"></line>
      <polyline points="17 7 17 17 7 17"></polyline>
    </svg>
  );
}
