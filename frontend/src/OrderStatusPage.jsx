import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Printer, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  ShoppingBag,
  ExternalLink,
  Building2,
  Calendar
} from 'lucide-react';
import { findOrder, getRecentOrders, getOrderTimeline, checkPincode, buildWhatsAppOrderMessage } from './orders.js';

const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function OrderStatusPage({ products = [] }) {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryId = orderId || searchParams.get('id') || searchParams.get('order');
  const [searchInput, setSearchInput] = useState(queryId || '');
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setRecentOrders(getRecentOrders());
  }, []);

  useEffect(() => {
    if (queryId) {
      const found = findOrder(queryId);
      setOrder(found);
      setSearchInput(queryId);
      setSearched(true);
    } else {
      setOrder(null);
      setSearched(false);
    }
  }, [queryId]);

  function handleSearch(e) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim();
    const found = findOrder(clean);
    setOrder(found);
    setSearched(true);
    if (found) {
      navigate(`/order/${encodeURIComponent(found.id)}`, { replace: true });
    }
  }

  function handleCopy(text) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handlePrint() {
    window.print();
  }

  const timeline = order ? getOrderTimeline(order) : [];
  const pinDetails = order?.customer?.postalCode ? checkPincode(order.customer.postalCode) : null;
  const isTN = pinDetails?.region === 'Tamil Nadu';

  return (
    <div className="order-status-page section-wrap">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Textiles</Link>
        <span>/</span>
        <span>Order Tracking</span>
      </nav>

      {/* Top Banner & Search Bar */}
      <div className="order-status-hero">
        <div className="eyebrow">RAJAMANI TEXTILES · ORDER LOOKUP</div>
        <h1>Track Your Textile Order</h1>
        <p className="order-status-subtitle">
          Direct handloom and home linen dispatches from Vilakkuthoon, Madurai.
        </p>

        <form className="order-search-form" onSubmit={handleSearch}>
          <div className="order-search-input-wrap">
            <Search size={18} className="search-icon"/>
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. RT-DEMO-2026-...) or 10-digit phone" 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              aria-label="Order reference number or phone"
            />
            {searchInput && (
              <button type="button" className="clear-btn" onClick={() => setSearchInput('')} aria-label="Clear">
                ×
              </button>
            )}
          </div>
          <button type="submit" className="primary order-search-submit">
            TRACK ORDER <ArrowRight size={16}/>
          </button>
        </form>
      </div>

      {/* Order Details View (when found) */}
      {order ? (
        <div className="order-status-content">
          {/* Header Card */}
          <div className="order-header-card">
            <div className="order-header-main">
              <div className="order-badge-row">
                <span className="order-live-status-pill confirmed">
                  <Check size={14}/> Confirmed &amp; In Handcraft Dispatch
                </span>
                {pinDetails?.badge && (
                  <span className={`order-region-pill ${isTN ? 'tn-priority' : 'interstate'}`}>
                    {pinDetails.badge}
                  </span>
                )}
              </div>
              <h2>Order Reference: <strong>{order.id}</strong></h2>
              <p className="order-meta-info">
                <span><Calendar size={14}/> Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Today'}</span>
                <span>•</span>
                <span>Dispatch: Vilakkuthoon, Madurai</span>
              </p>
            </div>

            <div className="order-header-actions no-print">
              <button 
                type="button" 
                className="secondary-btn copy-btn" 
                onClick={() => handleCopy(order.id)}
                title="Copy order number"
              >
                {copied ? <Check size={15} color="#16A34A"/> : <Copy size={15}/>}
                <span>{copied ? 'Copied!' : 'Copy Order ID'}</span>
              </button>
              <button 
                type="button" 
                className="secondary-btn print-btn" 
                onClick={handlePrint}
                title="Print invoice receipt"
              >
                <Printer size={15}/>
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Delivery Window Highlight */}
          <div className="order-delivery-banner">
            <Truck size={22} className="delivery-icon"/>
            <div>
              <strong>Estimated Delivery Window: {isTN ? '8 AM to 8 PM (Standard Daily Delivery)' : 'Interstate Express Delivery (3–5 Days)'}</strong>
              <p>
                {isTN 
                  ? 'Deliverable across Tamil Nadu. All standard dispatches are scheduled within our 8 AM to 8 PM delivery window.' 
                  : 'Shipped from our central Madurai loom warehouse via Indian Postal / Interstate courier.'}
              </p>
            </div>
          </div>

          {/* 4-Step Interactive Timeline */}
          <div className="order-tracker-card">
            <h3>Shipment Progress</h3>
            <div className="order-timeline-grid">
              {timeline.map((step, idx) => (
                <div key={step.id} className={`timeline-step ${step.status}`}>
                  <div className="timeline-node">
                    {step.status === 'completed' ? (
                      <Check size={16}/>
                    ) : step.status === 'current' ? (
                      <Package size={16}/>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <div className="timeline-info">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    {step.date && <small className="timeline-time">{step.date} · {step.time}</small>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Order Items & Delivery / Payment Summary */}
          <div className="order-two-col-grid">
            {/* Left: Items breakdown */}
            <div className="order-items-card">
              <h3>Items Ordered ({order.items?.length || 0})</h3>
              <div className="order-items-list">
                {order.items?.map((item, index) => {
                  const product = products.find(p => p.id === item.id);
                  return (
                    <div key={item.id || index} className="order-item-row">
                      <div className="order-item-media">
                        <img 
                          src={product?.image || '/images/hero-textiles.jpg'} 
                          alt={item.name}
                          style={{ objectPosition: product?.imagePosition || 'center' }}
                        />
                      </div>
                      <div className="order-item-details">
                        {product?.category && <span className="order-item-cat">{product.category}</span>}
                        <h4>
                          {product ? (
                            <Link to={`/products/${product.id}/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                              {item.name}
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h4>
                        <div className="order-item-price-row">
                          <span>{money(item.unitPrice)} × {item.quantity}</span>
                          <strong>{money(item.unitPrice * item.quantity)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Box */}
              <div className="order-price-calc">
                <div className="calc-row">
                  <span>Bag Subtotal</span>
                  <span>{money(order.subtotal || 0)}</span>
                </div>
                <div className="calc-row">
                  <span>Delivery &amp; Courier</span>
                  <span>{order.shipping === 0 ? 'Complimentary' : money(order.shipping)}</span>
                </div>
                <div className="calc-row total-row">
                  <strong>Total Amount</strong>
                  <strong>{money(order.total || 0)}</strong>
                </div>
              </div>
            </div>

            {/* Right: Customer & Payment Details */}
            <div className="order-side-cards">
              {/* Delivery Address Card */}
              <div className="order-side-card">
                <div className="side-card-title">
                  <MapPin size={17}/>
                  <h3>Delivery Address</h3>
                </div>
                {order.customer ? (
                  <div className="side-card-body">
                    <p className="cust-name"><strong>{order.customer.name}</strong></p>
                    <p className="cust-address">{order.customer.address}</p>
                    <p className="cust-city">{order.customer.city} — <strong>{order.customer.postalCode}</strong></p>
                    {order.customer.phone && (
                      <p className="cust-phone">
                        Phone: <span>{order.customer.phone}</span>
                      </p>
                    )}
                    {order.customer.email && (
                      <p className="cust-email">Email: <span>{order.customer.email}</span></p>
                    )}
                  </div>
                ) : (
                  <p className="side-card-empty">Delivery address saved securely with customer.</p>
                )}
              </div>

              {/* Payment Mode Card */}
              <div className="order-side-card">
                <div className="side-card-title">
                  <ShieldCheck size={17}/>
                  <h3>Payment Method</h3>
                </div>
                <div className="side-card-body">
                  <p><strong>{order.paymentMethod || 'UPI / Cash on Delivery'}</strong></p>
                  <p className="payment-note">
                    {order.paymentMethod?.toLowerCase().includes('cash') || order.paymentMethod?.toLowerCase().includes('cod')
                      ? 'Payable upon delivery at your doorstep.'
                      : 'Payment processed and verified.'}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp & Shop Support */}
              <div className="order-side-card wa-support-card no-print">
                <div className="side-card-title">
                  <MessageCircle size={17} color="#25D366"/>
                  <h3>Need Assistance?</h3>
                </div>
                <div className="side-card-body">
                  <p>Have a question or need to update your delivery address? Speak directly with shop staff.</p>
                  <a 
                    href={`https://wa.me/918667686067?text=${buildWhatsAppOrderMessage(order)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="order-wa-button"
                  >
                    <MessageCircle size={16}/> INQUIRE ON WHATSAPP
                  </a>
                  <a href="tel:9944563827" className="order-phone-link">
                    <Phone size={14}/> Call Shop: 99445 63827
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : searched ? (
        /* Not Found Message */
        <div className="order-not-found-card">
          <AlertCircle size={40} className="not-found-icon"/>
          <h2>No Order Found for “{searchInput}”</h2>
          <p>
            Please check your Order Reference Number (e.g. <code>RT-DEMO-2026-XXXXXX</code>) or verify that you entered the registered 10-digit mobile number.
          </p>
          <div className="not-found-actions">
            <button className="outline" onClick={() => setSearchInput('')}>
              TRY ANOTHER SEARCH
            </button>
            <a 
              href={`https://wa.me/918667686067?text=${encodeURIComponent(`Vanakkam Rajamani Textiles, I am looking for details regarding my order ${searchInput}.`)}`}
              target="_blank" 
              rel="noreferrer"
              className="primary"
            >
              <MessageCircle size={16}/> ASK ON WHATSAPP
            </a>
          </div>
        </div>
      ) : null}

      {/* Recent Orders on this Device (if any exist) */}
      {recentOrders.length > 0 && (
        <div className="recent-orders-section no-print">
          <div className="eyebrow">SAVED ON THIS DEVICE</div>
          <h3>Your Recent Orders</h3>
          <div className="recent-orders-grid">
            {recentOrders.map(ro => (
              <div 
                key={ro.id} 
                className={`recent-order-pill ${order?.id === ro.id ? 'active' : ''}`}
                onClick={() => {
                  setOrder(ro);
                  setSearchInput(ro.id);
                  setSearched(true);
                  navigate(`/order/${encodeURIComponent(ro.id)}`);
                }}
              >
                <div className="recent-order-pill-header">
                  <strong>{ro.id}</strong>
                  <span>{money(ro.total)}</span>
                </div>
                <div className="recent-order-pill-meta">
                  <span>{ro.createdAt ? new Date(ro.createdAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                  <span>{ro.items?.length || 1} items</span>
                  <span className="recent-view-link">View Status →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop Information Strip */}
      <div className="order-shop-strip no-print">
        <Building2 size={24} className="strip-icon"/>
        <div>
          <h4>Rajamani Textiles · Vilakkuthoon, Madurai</h4>
          <p>
            15, Mahal Vadampokki Street, Madurai - 625001. Store Hours: <strong>8 AM – 9:30 PM (Mon–Sun)</strong>. Direct dispatch across Tamil Nadu &amp; India.
          </p>
        </div>
        <Link to="/products" className="text-button">
          Continue Exploring Textiles <ArrowRight size={16}/>
        </Link>
      </div>
    </div>
  );
}
