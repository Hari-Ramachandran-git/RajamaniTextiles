import { useEffect, useRef, useState } from 'react';
import { Overlay } from './UI.jsx';
import { clearFilters, selectProducts } from './catalogue.js';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Heart, Leaf, Minus, MessageCircle, Phone, MapPin, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Truck, X } from 'lucide-react';

export const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
export const productUrl = p => `/products/${p.id}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
export const imageSrc = path => path;

const colors = {
  Crimson: '#9E1B28',
  Gold: '#D4AF37',
  Ivory: '#F5EFEB',
  White: '#FFFFFF',
  Navy: '#1A365D',
  Emerald: '#285547',
  Rose: '#E58C9B',
  Yellow: '#FDE047',
  Multicolor: 'linear-gradient(135deg, #9E1B28, #D4AF37, #1A365D)'
};

export function NandiEmblem({ className = '', size = 36 }) {
  return (
    <img 
      src="/images/nandi-logo.svg" 
      alt="Rajamani Textiles Nandi Logo" 
      className={`nandi-logo ${className}`} 
      style={{ width: size, height: size, objectFit: 'contain' }}
      loading="eager"
    />
  );
}

export function ProductCard({product:p, wishlist, toggleWish, add}) {
  const isWish = wishlist.includes(p.id);
  const swatchStyle = colors[p.color] 
    ? (colors[p.color].startsWith('linear') ? { background: colors[p.color] } : { backgroundColor: colors[p.color] })
    : { backgroundColor: '#888' };

  return (
    <article className="product">
      <div className="product-image">
        <Link className="product-photo" to={productUrl(p)} aria-label={`View ${p.name}`}>
          <img src={imageSrc(p.image)} alt={`${p.name} - ${p.category} from Rajamani Textiles Madurai`} style={{objectPosition:p.imagePosition || 'center'}} loading="lazy"/>
        </Link>
        {p.badge && <span className="badge">{p.badge}</span>}
        <button 
          className={`wishlist-button ${isWish ? 'saved' : ''}`} 
          aria-label={`${isWish ? 'Remove' : 'Save'} ${p.name} ${isWish ? 'from' : 'to'} wishlist`} 
          onClick={()=>toggleWish(p.id)}
        >
          <Heart size={18} fill={isWish ? 'currentColor' : 'none'}/>
        </button>
        <button className="quick-add" onClick={()=>add(p)}>
          ADD TO BAG <Plus size={16}/>
        </button>
      </div>
      <div className="product-meta">
        <span className="product-category-tag">{p.category.toUpperCase()} · {p.material.toUpperCase()}</span>
        <Link to={productUrl(p)}>
          <h3>{p.name}</h3>
        </Link>
        <div className="prices">
          <strong>{money(p.price)}</strong>
          {p.originalPrice && <s>{money(p.originalPrice)}</s>}
          {p.originalPrice && <small>{Math.round((1 - p.price / p.originalPrice) * 100)}% off</small>}
        </div>
        <div className="swatches">
          <i style={swatchStyle} title={p.color}/>
          <span>{p.color}</span>
        </div>
      </div>
    </article>
  );
}

function Breadcrumb({children}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span>/</span>
      {children}
    </nav>
  );
}

export const ALL_CATEGORIES = [
  'All Textiles',
  'Bedsheets',
  'Towels',
  'Pillows',
  'Beds',
  'Baby',
  'Function Shawls',
  'Inner Wears',
  'Door and Window Screens',
  'Bed Spread',
  'Bedcover'
];

function FilterFields({products, wishlist, wishlistOnly, values, onChange, namePrefix='catalogue'}) {
  const {category='All Textiles', occasion='All', color='All', price='All'} = values;

  return (
    <>
      <fieldset>
        <legend>Textile Category</legend>
        {ALL_CATEGORIES.map(c => {
          const matchCount = products.filter(p => (c === 'All Textiles' || p.category === c) && (!wishlistOnly || wishlist.includes(p.id))).length;
          return (
            <label key={c}>
              <input 
                type="radio" 
                name={`${namePrefix}-category`} 
                checked={category === c || (c === 'All Textiles' && (category === 'All' || category === 'All Products' || category === 'All Sarees'))} 
                onChange={()=>onChange('category', c === 'All Textiles' ? 'All' : c)}
              />
              {c}
              <span>{matchCount}</span>
            </label>
          );
        })}
      </fieldset>

      <fieldset>
        <legend>Usage & Occasion</legend>
        {['All', 'Everyday', 'Festive', 'Wedding', 'Home Comfort', 'Newborn'].map(o => (
          <label key={o}>
            <input 
              type="radio" 
              name={`${namePrefix}-occasion`} 
              checked={occasion === o} 
              onChange={()=>onChange('occasion', o)}
            />
            {o === 'All' ? 'Every occasion' : o}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Colour</legend>
        {['All', 'Crimson', 'Gold', 'Ivory', 'Navy', 'Emerald', 'White', 'Rose', 'Yellow', 'Multicolor'].map(c => {
          const swatchStyle = colors[c] 
            ? (colors[c].startsWith('linear') ? { background: colors[c] } : { backgroundColor: colors[c] })
            : undefined;

          return (
            <label key={c}>
              <input 
                type="radio" 
                name={`${namePrefix}-color`} 
                checked={color.toLowerCase() === c.toLowerCase()} 
                onChange={()=>onChange('color', c)}
              />
              {c !== 'All' && <i className="color-filter" style={swatchStyle}/>}
              {c === 'All' ? 'All colours' : c}
            </label>
          );
        })}
      </fieldset>

      <fieldset>
        <legend>Price Range</legend>
        {[
          ['All', 'All prices'],
          ['under1000', 'Under ₹1,000'],
          ['1000to2000', '₹1,000 – ₹2,000'],
          ['over2000', 'Above ₹2,000']
        ].map(([value, label]) => (
          <label key={value}>
            <input 
              type="radio" 
              name={`${namePrefix}-price`} 
              checked={price === value} 
              onChange={()=>onChange('price', value)}
            />
            {label}
          </label>
        ))}
      </fieldset>
    </>
  );
}

export function CataloguePage({products, wishlist, toggleWish, add, wishlistOnly=false}) {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categoryParam = params.get('category');
  const category = categoryParam || (wishlistOnly ? 'All Textiles' : 'All Textiles');
  const occasion = params.get('occasion') || 'All';
  const color = params.get('color') || 'All';
  const price = params.get('price') || 'All';
  const sort = params.get('sort') || 'featured';
  const search = params.get('search') || '';

  function update(key, value) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value === 'All' || value === 'All Textiles' || value === 'featured' || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    }, { replace: key === 'search' });
  }

  const effectiveCategory = (!category || category === 'All Textiles') ? 'All' : category;
  const filtered = selectProducts(products, {category: effectiveCategory, occasion, color, price, sort, search}, wishlistOnly ? wishlist : null);
  const [draft, setDraft] = useState({});
  const draftProducts = selectProducts(products, draft, wishlistOnly ? wishlist : null);

  function openFilters() {
    setDraft(Object.fromEntries(params));
    setFiltersOpen(true);
  }

  function resetFilters() {
    setParams(clearFilters(params));
  }

  const active = [
    ['category', category !== 'All Textiles' && category !== 'All' ? category : 'All'],
    ['occasion', occasion],
    ['color', color],
    ['price', price]
  ].filter(([, v]) => v !== 'All');

  return (
    <>
      <section className="catalogue-intro section-wrap">
        <Breadcrumb>
          <span aria-current="page">{wishlistOnly ? 'Wishlist' : 'Textile Catalogue'}</span>
        </Breadcrumb>
        <div className="eyebrow">{wishlistOnly ? 'SAVED WITH LOVE' : 'RAJAMANI TEXTILES · MADURAI'}</div>
        <h1>
          {wishlistOnly 
            ? 'Your Saved Favourites.' 
            : occasion !== 'All' 
              ? `${occasion} Collections & Home Essentials` 
              : category !== 'All Textiles' && category !== 'All'
                ? `${category} · Madurai Quality` 
                : 'Complete Home & Living Textiles'}
        </h1>
        <p>
          {wishlistOnly 
            ? 'All your shortlisted home textiles, bedsheets, towels, and shawls kept together.' 
            : 'Explore pure cotton bedsheets, towels, Ilavam Panju pillows & beds, baby bedding, ceremonial shawls, innerwear, curtains, and bedcovers.'}
        </p>
        <div className="store-pill-badges">
          <span><Sparkles size={14}/> Wholesale & Retail</span>
          <span><ShieldCheck size={14}/> 100% Genuine Quality</span>
          <span><MapPin size={14}/> Vilakkuthoon, Madurai</span>
        </div>
      </section>

      <section className="catalogue-layout section-wrap">
        <aside className="catalogue-filters" aria-label="Catalogue filters">
          <div className="filter-heading">
            <h2>Filter Collection</h2>
            <button className="text-button" onClick={resetFilters}>Reset filters</button>
          </div>
          <FilterFields 
            products={products} 
            wishlist={wishlist} 
            wishlistOnly={wishlistOnly} 
            values={{category: effectiveCategory, occasion, color, price}} 
            onChange={update}
          />
          <div className="filter-note">
            <NandiEmblem size={42}/>
            <p><strong>RAJAMANI TEXTILES</strong><br/>Wholesale & Retail Hub</p>
            <span>Vilakkuthoon, Madurai</span>
          </div>
        </aside>

        <div className="catalogue-results">
          <div className="catalogue-toolbar">
            <span role="status" aria-live="polite">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'item' : 'items'} available
            </span>
            <label className="sort-label">Sort by 
              <select aria-label="Sort products" value={sort} onChange={e=>update('sort', e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="catalogue-search">
            <Search size={17}/>
            <input 
              aria-label="Search catalogue" 
              placeholder="Search bedsheets, towels, pillows, beds, shawls, innerwear, curtains…" 
              value={search} 
              onChange={e=>update('search', e.target.value)}
            />
            {search && (
              <button className="icon" aria-label="Clear search" onClick={()=>update('search', '')}>
                <X size={15}/>
              </button>
            )}
            <button className="mobile-filter-button" aria-haspopup="dialog" onClick={openFilters}>
              <SlidersHorizontal size={15}/> Filters {active.length > 0 && <span className="filter-count">{active.length}</span>}
            </button>
          </div>

          {active.length > 0 && (
            <div className="filter-chips">
              {active.map(([key, value]) => (
                <button key={key} onClick={()=>update(key, 'All')}>
                  {key === 'price' 
                    ? (value === 'under1000' ? 'Under ₹1,000' : value === '1000to2000' ? '₹1,000 – ₹2,000' : 'Above ₹2,000') 
                    : value}
                  <X size={12}/>
                </button>
              ))}
              <button className="clear-all" onClick={resetFilters}>Clear filters</button>
            </div>
          )}

          <div className="product-grid catalogue-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWish={toggleWish} add={add}/>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <Heart size={32}/>
              <h2>{wishlistOnly && wishlist.length === 0 ? 'Your wishlist is currently empty.' : 'No textiles matched your selection.'}</h2>
              <p>{wishlistOnly && wishlist.length === 0 ? 'Tap the heart icon on any product to save it here.' : 'Try adjusting your search terms, category, or price filters.'}</p>
              {wishlistOnly && wishlist.length === 0 ? (
                <Link className="primary" to="/products">EXPLORE ALL TEXTILES <ArrowRight size={16}/></Link>
              ) : (
                <button className="outline" onClick={resetFilters}>RESET ALL FILTERS <X size={14}/></button>
              )}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="catalogue-end">
              <span>✦</span>
              <p>You have viewed all {filtered.length} {filtered.length === 1 ? 'item' : 'items'} in this selection.</p>
              <Link to="/products">Browse full catalogue <ArrowRight size={14}/></Link>
            </div>
          )}
        </div>
      </section>

      {filtersOpen && (
        <Overlay title="Filter textiles" close={()=>setFiltersOpen(false)} sheet>
          <div className="sheet-heading">
            <div className="sheet-handle"/>
            <div className="eyebrow">RAJAMANI TEXTILES</div>
            <h2>Refine Your Search</h2>
            <p>Filter by product category, material, usage, and price range.</p>
          </div>
          <div className="sheet-scroll">
            <FilterFields 
              products={products} 
              wishlist={wishlist} 
              wishlistOnly={wishlistOnly} 
              values={draft} 
              namePrefix="sheet" 
              onChange={(key, value)=>setDraft(d=>({...d, [key]: value}))}
            />
          </div>
          <div className="sheet-actions">
            <button className="text-button" onClick={()=>setDraft(Object.fromEntries(clearFilters(params)))}>
              Reset filters
            </button>
            <button 
              className="primary" 
              onClick={()=>{
                const next = new URLSearchParams(params);
                for (const key of ['category', 'occasion', 'color', 'price']) {
                  const value = draft[key];
                  if (!value || value === 'All' || value === 'All Textiles') next.delete(key);
                  else next.set(key, value);
                }
                setParams(next);
                setFiltersOpen(false);
              }}
            >
              SHOW {draftProducts.length} {draftProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'} <ArrowRight size={17}/>
            </button>
          </div>
        </Overlay>
      )}
    </>
  );
}

export function SareePage({products, wishlist, toggleWish, add, cart, buyNow}) {
  const {id} = useParams();
  const product = products.find(p => String(p.id) === id);
  const purchaseRef = useRef(null);
  const [purchaseVisible, setPurchaseVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setPurchaseVisible(entry.isIntersecting), {threshold: 0.25});
    if (purchaseRef.current) observer.observe(purchaseRef.current);
    return () => observer.disconnect();
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [pin, setPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  useEffect(() => {
    setQuantity(1);
    setPin('');
    setPinMessage('');
  }, [id]);

  if (!product) return <NotFoundPage product/>;

  const p = product;
  const existing = cart.find(x => x.id === p.id)?.quantity || 0;
  const limit = typeof p.stock === 'number' ? p.stock : (p.stock === 'out' ? 0 : (p.stock === 'low' ? 3 : 20));
  const available = Math.max(0, limit - existing);
  const safeQuantity = Math.min(quantity, Math.max(1, available));

  const related = [
    ...products.filter(x => x.id !== p.id && x.category === p.category),
    ...products.filter(x => x.id !== p.id && x.category !== p.category)
  ].slice(0, 4);

  const whatsappMessage = encodeURIComponent(`Hello Rajamani Textiles! I am interested in: ${p.name} (Code: RT-${String(p.id).padStart(3, '0')}, Price: ₹${p.price}). Please share details and wholesale/retail availability.`);

  return (
    <div className="saree-page">
      <div className="section-wrap">
        <Breadcrumb>
          <Link to="/products">All textiles</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(p.category)}`}>{p.category}</Link>
          <span>/</span>
          <span aria-current="page">{p.name}</span>
        </Breadcrumb>

        <section className="saree-layout">
          <div className="saree-gallery">
            <div className="saree-main-image">
              <img src={imageSrc(p.image)} alt={`${p.name} - ${p.category} from Rajamani Textiles`} style={{objectPosition: p.imagePosition || 'center'}}/>
              {p.badge && <span className="badge">{p.badge}</span>}
              <span className="gallery-caption">GENUINE MADURAI QUALITY</span>
            </div>
            
            <div className="store-assurance-card">
              <div className="assurance-header">
                <NandiEmblem size={28}/>
                <div>
                  <strong>RAJAMANI TEXTILES</strong>
                  <p>15, Mahal Vadampokki St, Vilakkuthoon, Madurai - 625001</p>
                </div>
              </div>
              <div className="assurance-contact">
                <span><Phone size={13}/> Call: 99445 63827</span>
                <span><MessageCircle size={13}/> WhatsApp: 86676 86067</span>
              </div>
            </div>
          </div>

          <div className="saree-info">
            <div className="eyebrow">{p.category.toUpperCase()} · {p.occasion.toUpperCase()}</div>
            <h1>{p.name}</h1>
            <p className="saree-subtitle">Direct from Madurai textile hub · Wholesale & Retail excellence</p>

            <div className="saree-price">
              <strong>{money(p.price)}</strong>
              {p.originalPrice && <s>{money(p.originalPrice)}</s>}
              {p.originalPrice && <span>SAVE {Math.round((1 - p.price / p.originalPrice) * 100)}%</span>}
            </div>
            <span className="tax-note">Inclusive of all taxes · GSTIN displayed in footer</span>

            <p className="saree-description">{p.description}</p>

            <div className="saree-color">
              <span>Colour: <strong>{p.color}</strong></span>
              <i style={colors[p.color] ? (colors[p.color].startsWith('linear') ? {background: colors[p.color]} : {backgroundColor: colors[p.color]}) : {backgroundColor: '#888'}}/>
            </div>

            <div className="included-note">
              <Check size={16}/> Dimensions / Pack: <strong>{p.length}</strong>
            </div>

            <div className="saree-purchase">
              <div>
                <span className="quantity-label">QUANTITY</span>
                <div className="quantity">
                  <button aria-label="Decrease quantity" disabled={safeQuantity <= 1} onClick={()=>setQuantity(q=>Math.max(1, q-1))}>
                    <Minus size={14}/>
                  </button>
                  <span>{safeQuantity}</span>
                  <button aria-label="Increase quantity" disabled={safeQuantity >= available} onClick={()=>setQuantity(q=>Math.min(available, q+1))}>
                    <Plus size={14}/>
                  </button>
                </div>
              </div>
              <p className="stock-note">
                <i/>{p.stock === 'out' ? 'Currently out of stock' : p.stock === 'low' ? 'Low stock — selling fast' : p.stock === 'in_stock' ? 'In stock · Ready for dispatch' : (available > 0 ? `In stock (${available} units available)` : 'All available units are currently in your bag')}
              </p>
            </div>

            <div className="saree-actions" ref={purchaseRef}>
              <button className="primary" disabled={available === 0} onClick={()=>add(p, safeQuantity)}>
                ADD TO BAG <ShoppingBag size={18}/>
              </button>
              <button 
                className={`outline wish-action ${wishlist.includes(p.id) ? 'saved' : ''}`} 
                aria-label={`${wishlist.includes(p.id) ? 'Remove' : 'Save'} ${p.name} ${wishlist.includes(p.id) ? 'from' : 'to'} wishlist`} 
                onClick={()=>toggleWish(p.id)}
              >
                <Heart size={20} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'}/>
              </button>
            </div>

            <div className="direct-buttons-row">
              <button className="outline buy-now" disabled={available === 0} onClick={()=>buyNow(p, safeQuantity)}>
                BUY NOW <ArrowRight size={17}/>
              </button>

              <a 
                className="whatsapp-order-btn" 
                href={`https://wa.me/918667686067?text=${whatsappMessage}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle size={18}/> ORDER ON WHATSAPP
              </a>
            </div>

            <Link to="/products" className="continue-browsing">← Continue browsing collection</Link>

            <div className="saree-service">
              <span><Truck size={17}/> Free shipping above ₹1,999</span>
              <span><ShieldCheck size={17}/> Wholesale & Retail Available</span>
              <span><Check size={17}/> GST Invoice Provided</span>
            </div>

            <div className="delivery-check">
              <label htmlFor="delivery-pin">Delivery & Pincode Check</label>
              <form onSubmit={e=>{
                e.preventDefault();
                setPinMessage(/^[1-9][0-9]{5}$/.test(pin) ? `Delivery available to ${pin}. Standard dispatch within 24–48 hours from Madurai.` : 'Please enter a valid 6-digit Indian PIN code.');
              }}>
                <input 
                  id="delivery-pin" 
                  inputMode="numeric" 
                  maxLength={6} 
                  placeholder="Enter 6-digit PIN code" 
                  value={pin} 
                  onChange={e=>{
                    setPin(e.target.value.replace(/\D/g, ''));
                    setPinMessage('');
                  }}
                />
                <button type="submit">CHECK <ArrowRight size={13}/></button>
              </form>
              {pinMessage && <p role="status">{pinMessage}</p>}
            </div>

            <div className="saree-accordions">
              <details open>
                <summary>Product Specifications</summary>
                <dl>
                  <dt>Category</dt>
                  <dd>{p.category}</dd>
                  <dt>Fabric / Material</dt>
                  <dd>{p.material}</dd>
                  <dt>Colour</dt>
                  <dd>{p.color}</dd>
                  <dt>Size / Dimensions</dt>
                  <dd>{p.length}</dd>
                  <dt>Usage / Occasion</dt>
                  <dd>{p.occasion}</dd>
                  <dt>Product Code</dt>
                  <dd>RT-{String(p.id).padStart(3, '0')}</dd>
                </dl>
              </details>

              <details>
                <summary>Wash & Fabric Care</summary>
                <p>{p.care}. Ensure gentle care to prolong the vibrant colors and natural texture of your textiles.</p>
              </details>

              <details>
                <summary>Wholesale & Bulk Orders</summary>
                <p>We provide bulk and wholesale pricing for hotels, hospitals, hostels, marriage gifts, and retailers. Contact Mr. N. Subramanian directly at <strong>99445 63827</strong> or WhatsApp <strong>86676 86067 / 63793 80253</strong>.</p>
              </details>

              <details>
                <summary>Store Visit & Verification</summary>
                <p>Visit our store at <strong>15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001</strong>. GST Registration: <strong>33**********1Z0 (Verified)</strong>.</p>
              </details>
            </div>
          </div>
        </section>
      </div>

      <div className={`mobile-purchase ${purchaseVisible ? 'hidden' : ''}`}>
        <div>
          <strong>{money(p.price)}</strong>
          <span>{p.name}</span>
        </div>
        <button className="primary" disabled={available === 0} aria-label={`Add ${p.name} to bag`} onClick={()=>add(p, safeQuantity)}>
          {available === 0 ? 'IN YOUR BAG' : 'ADD TO BAG'} <ShoppingBag size={17}/>
        </button>
      </div>

      <section className="saree-story-strip">
        <NandiEmblem size={34}/>
        <div>
          <h2>Rajamani Textiles · Trusted Madurai Quality</h2>
          <p>Wholesale and retail specialists in Bedsheets, Towels, Pillows, Beds, Shawls & Home Linens.</p>
        </div>
        <Link to="/our-story">ABOUT SHOP <ArrowUpRight size={17}/></Link>
      </section>

      <section className="related-section section-wrap">
        <div className="collection-title">
          <div>
            <div className="eyebrow">MORE FROM OUR SHOP</div>
            <h2>You May Also Like…</h2>
          </div>
          <Link to="/products">View all textiles <ArrowRight size={16}/></Link>
        </div>
        <div className="product-grid">
          {related.map(x => (
            <ProductCard key={x.id} product={x} wishlist={wishlist} toggleWish={toggleWish} add={add}/>
          ))}
        </div>
      </section>
    </div>
  );
}

export function StoryPage() {
  return (
    <>
      <section className="story-page-intro section-wrap">
        <Breadcrumb>
          <span aria-current="page">About Our Shop</span>
        </Breadcrumb>
        <div className="eyebrow">MADURAI'S TEXTILE HERITAGE</div>
        <h1>Welcome to<br/><em>RAJAMANI TEXTILES</em></h1>
        <p>Serving generations with premium home textiles, bed linens, function shawls, and bedding comfort from the historic heart of Madurai.</p>
      </section>

      <section className="story-page-body section-wrap">
        <div className="story-image-wrapper">
          <img src="/images/hero-textiles.jpg" alt="Rajamani Textiles Madurai Home Linens" className="story-photo"/>
          <div className="story-image-caption">
            <NandiEmblem size={24}/>
            <span>Madurai Handlooms &amp; Home Textiles · Established Tradition</span>
          </div>
        </div>

        <div>
          <div className="eyebrow">OUR HERITAGE & PROMISE</div>
          <h2>Rooted in Vilakkuthoon, Madurai</h2>
          <p>
            Located at <strong>15, Mahal Vadampokki Street, Vilakkuthoon, Madurai</strong> — right in the vibrant cultural and commercial centre near the famed Thirumalai Nayakkar Mahal — <strong>RAJAMANI TEXTILES</strong> has earned an enduring reputation for authentic quality, honest wholesale pricing, and personal customer service.
          </p>
          <p>
            Under the experienced leadership of <strong>Mr. N. Subramanian</strong>, we cater to retail shoppers, households, function organizers, hotels, and bulk buyers across Tamil Nadu and beyond.
          </p>
          <p>
            Our emblem is <strong>Lord Nandi</strong>, symbolizing sacred strength, steadfast integrity, purity of cotton, and timeless tradition in every thread we offer.
          </p>

          <div className="shop-key-details">
            <div className="detail-item">
              <strong>Proprietor:</strong>
              <span>N. Subramanian</span>
            </div>
            <div className="detail-item">
              <strong>Phone Calls:</strong>
              <a href="tel:9944563827">99445 63827</a>
            </div>
            <div className="detail-item">
              <strong>WhatsApp Orders:</strong>
              <div className="wa-links">
                <a href="https://wa.me/918667686067" target="_blank" rel="noreferrer">86676 86067</a>
                <span>·</span>
                <a href="https://wa.me/916379380253" target="_blank" rel="noreferrer">63793 80253</a>
              </div>
            </div>
            <div className="detail-item">
              <strong>GST Registration:</strong>
              <span>33**********1Z0 (Verified in Footer)</span>
            </div>
            <div className="detail-item">
              <strong>Address:</strong>
              <span>15, Mahal Vadampokki Street, Vilakkuthoon, Madurai - 625001.</span>
            </div>
          </div>

          <Link className="primary" to="/products">EXPLORE OUR COLLECTION <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="range-summary-section section-wrap">
        <div className="section-heading">
          <div className="eyebrow">WHAT WE DEAL WITH</div>
          <h2>Our Complete Product Range</h2>
          <p>We stock and supply a comprehensive selection of premium goods at wholesale & retail rates:</p>
        </div>
        <div className="goods-list-grid">
          {[
            ['Bedsheets', 'Double, single & king size 100% pure cotton bedsheets with pillow covers in traditional and modern prints.'],
            ['Towels', 'Madurai authentic waffle cotton towels, Turkish plush bath towels, and hand/face towel sets.'],
            ['Pillows', 'Handmade pure Ilavam Panju (silk cotton) cooling pillows and hotel microfiber cloud pillows.'],
            ['Beds & Mattresses', 'Madurai special hand-tufted Ilavam Panju cotton mattresses and portable tri-fold guest beds.'],
            ['Baby Section', '3-in-1 portable travel beds, waterproof quick dry sheets, umbrella mosquito nets, newborn luxury gift boxes, sleeping nests & bolsters.'],
            ['Function Shawls', 'Royal gold zari Ponnada felicitation shawls and ceremonial velvet-trimmed wedding gift shawls.'],
            ['Inner Wears', '100% super combed cotton daily vests, breathable briefs, and trunks for men and boys.'],
            ['Door & Window Screens', 'Woven jacquard eyelet door curtains (7ft) and room-darkening window screens (5ft).'],
            ['Bed Spreads', 'Heavy traditional Madurai handloom jacquard bedspreads with tassels and chenille velvet spreads.'],
            ['Bed Covers', 'All-season ultrasonic quilted bedcovers and 100% waterproof elastic fitted mattress protectors.']
          ].map(([title, desc]) => (
            <div key={title} className="good-item-card">
              <Check size={20} className="good-icon"/>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="story-principles section-wrap">
        {[
          [Leaf, '100% Pure Cotton & Natural Kapok', 'From pure Madurai cotton to organic Ilavam Panju, natural cooling and softness in every item.'],
          [Sparkles, 'Direct Loom & Wholesale Value', 'By sourcing directly from textile loom hubs, we pass maximum value and savings to our retail and bulk customers.'],
          [ShieldCheck, 'GST Compliant & Trusted Tradition', 'Full commercial transparency with verified GSTIN (see footer) and prompt WhatsApp/phone support.']
        ].map(([Icon, title, text]) => (
          <article key={title}>
            <Icon size={25}/>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </>
  );
}

export function NotFoundPage({product=false}) {
  return (
    <section className="not-found section-wrap">
      <div className="eyebrow">{product ? 'PRODUCT NOT FOUND' : 'PAGE NOT FOUND'}</div>
      <h1>{product ? 'This textile item is not in our catalogue.' : 'This page seems to have moved.'}</h1>
      <p>Browse our extensive collection of bedsheets, towels, pillows, beds, shawls, and home textiles.</p>
      <Link className="primary" to="/products">EXPLORE ALL TEXTILES <ArrowRight size={17}/></Link>
    </section>
  );
}
