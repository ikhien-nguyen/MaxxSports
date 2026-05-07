import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/productDetailData';
import './Checkout.css';

/* ── Inline SVG Icons ──────────────────────────────────────── */
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 4v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const NoteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Helper: parse numeric price from various formats ──────── */
function parseNumericPrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
  }
  return 0;
}

/* ── Helper: generate order ID ─────────────────────────────── */
function generateOrderID() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `#MS${y}${m}${d}${suffix}`;
}

/* ── Inline SVG: Address Book Icon ─────────────────────────── */
const BookOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

/* ── CHECKOUT PAGE COMPONENT ───────────────────────────────── */
export default function Checkout() {
  /* ── Auth guard ── */
  useEffect(() => {
    const user = localStorage.getItem('maxxsport_user');
    if (!user) {
      window.location.href = '/auth';
    }
  }, []);

  /* ── Load user data ── */
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maxxsport_user')) || {};
    } catch { return {}; }
  });

  /* ── Load cart data ── */
  const [cartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maxxsport_cart') || '[]');
    } catch { return []; }
  });

  /* ── Load saved addresses from address book ── */
  const [savedAddresses] = useState(() => {
    try {
      const key = `maxxsport_addresses_${user.email || 'guest'}`;
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  });

  /* ── Smart auto-fill: default address → user profile fallback ── */
  const [form, setForm] = useState(() => {
    const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
    if (defaultAddr) {
      return {
        name: defaultAddr.name || user.name || '',
        email: user.email || '',
        phone: defaultAddr.phone || user.phone || '',
        address: defaultAddr.street || '',
        city: defaultAddr.city || '',
        district: defaultAddr.district || '',
        ward: defaultAddr.ward || '',
        note: '',
      };
    }
    return {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: '',
      city: '',
      district: '',
      ward: '',
      note: '',
    };
  });

  /* ── Apply a saved address to the form ── */
  const applyAddress = (addr) => {
    setForm(prev => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: addr.street || '',
      city: addr.city || '',
      district: addr.district || '',
      ward: addr.ward || '',
    }));
    setErrors({});
  };

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [showVNPayModal, setShowVNPayModal] = useState(false);

  /* ── Form handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /* ── Validation ── */
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email không hợp lệ';
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.city.trim()) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    if (!form.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Create order & persist to localStorage ── */
  const createOrder = () => {
    const orderId = generateOrderID();
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

    const newOrder = {
      id: orderId,
      date: dateStr,
      items: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity || 1,
        price: parseNumericPrice(item.price),
      })),
      total: totalPrice,
      status: 'Chờ xác nhận',
      payment: paymentMethod === 'vnpay' ? 'VNPAY QR' : 'COD',
      shipping: {
        name: form.name,
        phone: form.phone,
        address: [form.address, form.ward, form.district, form.city].filter(Boolean).join(', '),
      },
    };

    // Persist order
    try {
      const existing = JSON.parse(localStorage.getItem('maxxsport_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('maxxsport_orders', JSON.stringify(existing));
    } catch {
      localStorage.setItem('maxxsport_orders', JSON.stringify([newOrder]));
    }

    // Store last order for Success page
    localStorage.setItem('maxxsport_last_order', JSON.stringify(newOrder));

    // Clear cart
    localStorage.setItem('maxxsport_cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('systemDataUpdated'));
  };

  /* ── Submit order ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (paymentMethod === 'vnpay') {
      setShowVNPayModal(true);
      setTimeout(() => {
        createOrder();
        window.location.href = '/success';
      }, 7000);
    } else {
      createOrder();
      window.location.href = '/success';
    }
  };

  /* ── Calculations ── */
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseNumericPrice(item.price);
    return sum + price * (item.quantity || 1);
  }, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const totalPrice = subtotal + shippingFee;

  /* ── Provinces (subset for dropdown) ── */
  const provinces = [
    'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Thừa Thiên Huế',
    'Quảng Ninh', 'Bà Rịa - Vũng Tàu', 'Long An', 'An Giang', 'Nghệ An',
  ];

  /* ── VNPAY Overlay Modal ── */
  const VNPayModal = () => (
    <div className="checkout-vnpay-overlay" id="vnpay-modal">
      <div className="checkout-vnpay-modal">
        <button
          type="button"
          className="checkout-vnpay-close"
          onClick={() => setShowVNPayModal(false)}
          aria-label="Đóng"
        >
          <CloseIcon />
        </button>

        <div className="checkout-vnpay-header">
          <div className="checkout-vnpay-logo">
            <span className="checkout-vnpay-logo__text">VNPAY</span>
          </div>
          <h3 className="checkout-vnpay-title">Quét mã QR để thanh toán</h3>
          <p className="checkout-vnpay-subtitle">
            Sử dụng ứng dụng ngân hàng hoặc ví điện tử hỗ trợ VNPAY-QR
          </p>
        </div>

        <div className="checkout-vnpay-qr">
          {/* Fake QR code using CSS grid pattern */}
          <div className="checkout-vnpay-qr__code" aria-label="Mã QR thanh toán">
            <div className="qr-pattern">
              {Array.from({ length: 169 }, (_, i) => (
                <div
                  key={i}
                  className={`qr-cell ${Math.random() > 0.45 ? 'qr-cell--filled' : ''}`}
                />
              ))}
              {/* Corner markers */}
              <div className="qr-corner qr-corner--tl" />
              <div className="qr-corner qr-corner--tr" />
              <div className="qr-corner qr-corner--bl" />
            </div>
          </div>
        </div>

        <div className="checkout-vnpay-amount">
          <span>Số tiền thanh toán</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>

        <div className="checkout-vnpay-timer">
          <div className="checkout-vnpay-spinner" />
          <span>Đang chờ thanh toán... Tự động chuyển trang sau vài giây</span>
        </div>

        <div className="checkout-vnpay-banks">
          <span>Hỗ trợ bởi</span>
          <div className="checkout-vnpay-banks__list">
            <span className="checkout-vnpay-bank">Vietcombank</span>
            <span className="checkout-vnpay-bank">Techcombank</span>
            <span className="checkout-vnpay-bank">MB Bank</span>
            <span className="checkout-vnpay-bank">MoMo</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Redirect if no cart items ── */
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <h2>Giỏ hàng trống</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
            <a href="/new-arrivals" className="checkout-empty__btn">Mua sắm ngay</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* ── VNPAY Modal ── */}
      {showVNPayModal && <VNPayModal />}

      {/* ── Breadcrumb ── */}
      <div className="checkout-breadcrumb">
        <div className="checkout-breadcrumb__inner">
          <Link to="/" className="checkout-breadcrumb__link">Trang chủ</Link>
          <span className="checkout-breadcrumb__sep">/</span>
          <Link to="/cart" className="checkout-breadcrumb__link">Giỏ hàng</Link>
          <span className="checkout-breadcrumb__sep">/</span>
          <span className="checkout-breadcrumb__current">Thanh toán</span>
        </div>
      </div>

      <div className="checkout-container">
        <h1 className="checkout-title" id="checkout-page-title">THANH TOÁN ĐƠN HÀNG</h1>

        <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
          {/* ══════════════════════════════════════════════
              LEFT COLUMN: Shipping + Payment Method (60%)
             ══════════════════════════════════════════════ */}
          <div className="checkout-left">

            {/* ── Shipping Information ── */}
            <section className="checkout-section" id="shipping-section">
              <div className="checkout-section__header">
                <MapPinIcon />
                <h2 className="checkout-section__title">Thông tin giao hàng</h2>
              </div>

              {/* Address book picker */}
              {savedAddresses.length > 0 && (
                <div className="checkout-addr-picker" id="checkout-addr-picker">
                  <BookOpenIcon />
                  <select
                    className="checkout-addr-picker__select"
                    onChange={(e) => {
                      const addr = savedAddresses.find(a => a.id === e.target.value);
                      if (addr) applyAddress(addr);
                    }}
                    defaultValue={savedAddresses.find(a => a.isDefault)?.id || ''}
                  >
                    <option value="" disabled>Chọn từ sổ địa chỉ...</option>
                    {savedAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label || 'Địa chỉ'} — {addr.name}, {addr.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="checkout-form-grid">
                {/* Name */}
                <div className={`checkout-field ${errors.name ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-name">
                    Họ tên <span className="checkout-required">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    name="name"
                    className="checkout-input"
                    placeholder="Nhập họ tên người nhận"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  {errors.name && <span className="checkout-error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className={`checkout-field ${errors.email ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-email">
                    Email <span className="checkout-required">*</span>
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    name="email"
                    className="checkout-input"
                    placeholder="Nhập email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <span className="checkout-error">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className={`checkout-field ${errors.phone ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-phone">
                    Số điện thoại <span className="checkout-required">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    className="checkout-input"
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  {errors.phone && <span className="checkout-error">{errors.phone}</span>}
                </div>

                {/* City */}
                <div className={`checkout-field ${errors.city ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-city">
                    Tỉnh/Thành phố <span className="checkout-required">*</span>
                  </label>
                  <select
                    id="checkout-city"
                    name="city"
                    className="checkout-input checkout-select"
                    value={form.city}
                    onChange={handleChange}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.city && <span className="checkout-error">{errors.city}</span>}
                </div>

                {/* District */}
                <div className={`checkout-field ${errors.district ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-district">
                    Quận/Huyện <span className="checkout-required">*</span>
                  </label>
                  <input
                    id="checkout-district"
                    type="text"
                    name="district"
                    className="checkout-input"
                    placeholder="Nhập quận/huyện"
                    value={form.district}
                    onChange={handleChange}
                  />
                  {errors.district && <span className="checkout-error">{errors.district}</span>}
                </div>

                {/* Ward */}
                <div className="checkout-field">
                  <label className="checkout-label" htmlFor="checkout-ward">
                    Phường/Xã
                  </label>
                  <input
                    id="checkout-ward"
                    type="text"
                    name="ward"
                    className="checkout-input"
                    placeholder="Nhập phường/xã"
                    value={form.ward}
                    onChange={handleChange}
                  />
                </div>

                {/* Address - full width */}
                <div className={`checkout-field checkout-field--full ${errors.address ? 'checkout-field--error' : ''}`}>
                  <label className="checkout-label" htmlFor="checkout-address">
                    Địa chỉ cụ thể <span className="checkout-required">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    name="address"
                    className="checkout-input"
                    placeholder="Số nhà, tên đường..."
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                  {errors.address && <span className="checkout-error">{errors.address}</span>}
                </div>

                {/* Note - full width */}
                <div className="checkout-field checkout-field--full">
                  <label className="checkout-label" htmlFor="checkout-note">
                    <NoteIcon />
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    id="checkout-note"
                    name="note"
                    className="checkout-input checkout-textarea"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* ── Payment Method ── */}
            <section className="checkout-section" id="payment-section">
              <div className="checkout-section__header">
                <CreditCardIcon />
                <h2 className="checkout-section__title">Phương thức thanh toán</h2>
              </div>

              <div className="checkout-payment-methods">
                {/* COD */}
                <label
                  className={`checkout-payment-option ${paymentMethod === 'cod' ? 'checkout-payment-option--active' : ''}`}
                  htmlFor="payment-cod"
                  id="payment-option-cod"
                >
                  <input
                    id="payment-cod"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="checkout-payment-radio"
                  />
                  <div className="checkout-payment-radio__custom" />
                  <div className="checkout-payment-info">
                    <span className="checkout-payment-name">
                      <TruckIcon />
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="checkout-payment-desc">
                      Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ giao hàng
                    </span>
                  </div>
                </label>

                {/* VNPAY QR */}
                <label
                  className={`checkout-payment-option ${paymentMethod === 'vnpay' ? 'checkout-payment-option--active' : ''}`}
                  htmlFor="payment-vnpay"
                  id="payment-option-vnpay"
                >
                  <input
                    id="payment-vnpay"
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="checkout-payment-radio"
                  />
                  <div className="checkout-payment-radio__custom" />
                  <div className="checkout-payment-info">
                    <span className="checkout-payment-name">
                      <CreditCardIcon />
                      VNPAY QR
                    </span>
                    <span className="checkout-payment-desc">
                      Thanh toán qua quét mã QR bằng ứng dụng ngân hàng hoặc ví VNPAY
                    </span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN: Order Summary (40%)
             ══════════════════════════════════════════════ */}
          <aside className="checkout-right">
            <div className="checkout-summary" id="order-summary">
              <h2 className="checkout-summary__title">Đơn hàng của bạn</h2>

              {/* Cart items mini-list */}
              <div className="checkout-summary__items">
                {cartItems.map((item, index) => {
                  const unitPrice = parseNumericPrice(item.price);
                  const lineTotal = unitPrice * (item.quantity || 1);
                  return (
                    <div className="checkout-summary__item" key={`${item.id}_${index}`}>
                      <div className="checkout-summary__item-img">
                        <img
                          src={item.image || item.images?.[0] || '/assets/products/placeholder.png'}
                          alt={item.name}
                          loading="lazy"
                        />
                        <span className="checkout-summary__item-qty">{item.quantity || 1}</span>
                      </div>
                      <div className="checkout-summary__item-info">
                        <span className="checkout-summary__item-name">{item.name}</span>
                        <div className="checkout-summary__item-variants">
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span>Màu: {item.selectedColor}</span>}
                        </div>
                      </div>
                      <span className="checkout-summary__item-price">{formatPrice(lineTotal)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="checkout-summary__lines">
                <div className="checkout-summary__line">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="checkout-summary__line">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'checkout-summary__free' : ''}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="checkout-summary__total">
                <span>Tổng cộng</span>
                <span className="checkout-summary__total-price">{formatPrice(totalPrice)}</span>
              </div>

              {/* Submit button */}
              <button type="submit" className="checkout-submit-btn" id="place-order-btn">
                {paymentMethod === 'vnpay' ? 'THANH TOÁN VỚI VNPAY' : 'ĐẶT HÀNG'}
              </button>

              {/* Trust badges */}
              <div className="checkout-trust">
                <div className="checkout-trust__item">
                  <ShieldCheckIcon />
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="checkout-trust__item">
                  <TruckIcon />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="checkout-trust__item">
                  <CheckCircleIcon />
                  <span>Đổi trả miễn phí 30 ngày</span>
                </div>
              </div>

              {/* Back to cart */}
              <Link to="/cart" className="checkout-back-link">
                ← Quay lại giỏ hàng
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
