import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/productDetailData';
import './Cart.css';

/* ── Inline SVG Icons ──────────────────────────────────────── */
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const EmptyCartIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="60" r="56" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="6 4"/>
    <path d="M35 40h6l4 30h30l4-22H49" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="52" cy="78" r="4" fill="#ddd"/>
    <circle cx="72" cy="78" r="4" fill="#ddd"/>
    <path d="M50 52l20 16M70 52L50 68" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 8h4l3 4v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
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

/* ── CART PAGE COMPONENT ───────────────────────────────────── */
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  /* ── Load cart from localStorage on mount ─────────────────── */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('xsport_cart') || '[]');
      setCartItems(stored);
    } catch {
      setCartItems([]);
    }
  }, []);

  /* ── Persist cart to localStorage + fire global event ──────── */
  const syncToStorage = useCallback((items) => {
    localStorage.setItem('xsport_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdated'));
  }, []);

  /* ── Unique key for each cart item ───────────────────────── */
  const itemKey = (item) =>
    `${item.id}_${item.selectedSize || ''}_${item.selectedColor || ''}`;

  /* ── Update quantity ─────────────────────────────────────── */
  const handleUpdateQuantity = (id, selectedSize, selectedColor, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map((item) => {
      if (
        String(item.id) === String(id) &&
        (item.selectedSize || '') === (selectedSize || '') &&
        (item.selectedColor || '') === (selectedColor || '')
      ) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    syncToStorage(updated);
  };

  /* ── Remove item ─────────────────────────────────────────── */
  const handleRemoveItem = (id, selectedSize, selectedColor) => {
    const updated = cartItems.filter((item) => !(
      String(item.id) === String(id) &&
      (item.selectedSize || '') === (selectedSize || '') &&
      (item.selectedColor || '') === (selectedColor || '')
    ));
    setCartItems(updated);
    syncToStorage(updated);
  };

  /* ── Clear entire cart ───────────────────────────────────── */
  const handleClearCart = () => {
    setCartItems([]);
    syncToStorage([]);
  };

  /* ── Coupon (mock) ───────────────────────────────────────── */
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMsg('Vui lòng nhập mã giảm giá');
      return;
    }
    setCouponMsg('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    setTimeout(() => setCouponMsg(''), 3000);
  };

  /* ── Calculations ────────────────────────────────────────── */
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseNumericPrice(item.price);
    return sum + price * (item.quantity || 1);
  }, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const totalPrice = subtotal + shippingFee;

  /* ── EMPTY CART STATE ────────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty__icon">
              <EmptyCartIcon />
            </div>
            <h2 className="cart-empty__title">Giỏ hàng trống</h2>
            <p className="cart-empty__text">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng.
              <br />Khám phá các sản phẩm mới nhất ngay!
            </p>
            <a href="/new-arrivals" className="btn-continue cart-empty__btn">
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN CART RENDER ────────────────────────────────────── */
  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumb */}
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="cart-breadcrumb__link">Trang chủ</Link>
          <span className="cart-breadcrumb__sep">/</span>
          <span className="cart-breadcrumb__current">Giỏ hàng ({totalItems})</span>
        </nav>

        <h1 className="cart-title">
          Giỏ hàng của bạn
          <span className="cart-title__count">{totalItems} sản phẩm</span>
        </h1>

        <div className="cart-layout">
          {/* ── LEFT COLUMN: Cart Items ── */}
          <div className="cart-items">
            {/* Table header (desktop) */}
            <div className="cart-items__header">
              <span className="cart-items__col cart-items__col--product">Sản phẩm</span>
              <span className="cart-items__col cart-items__col--price">Đơn giá</span>
              <span className="cart-items__col cart-items__col--qty">Số lượng</span>
              <span className="cart-items__col cart-items__col--total">Thành tiền</span>
              <span className="cart-items__col cart-items__col--action"></span>
            </div>

            {/* Cart item rows */}
            {cartItems.map((item, index) => {
              const unitPrice = parseNumericPrice(item.price);
              const lineTotal = unitPrice * (item.quantity || 1);
              const key = item.cartId || `${itemKey(item)}_${index}`;

              return (
                <div className="cart-item" key={key}>
                  {/* Product info */}
                  <div className="cart-item__product">
                    <a
                      href={"/product/" + item.id}
                      className="cart-item__img-link"
                      aria-label={`Xem ${item.name}`}
                    >
                      <img
                        src={item.image || item.images?.[0] || '/assets/products/placeholder.png'}
                        alt={item.name}
                        className="cart-item__img"
                        loading="lazy"
                      />
                    </a>
                    <div className="cart-item__details">
                      <a href={"/product/" + item.id} className="cart-item__name">
                        {item.name}
                      </a>
                      {item.brand && (
                        <span className="cart-item__brand">{item.brand}</span>
                      )}
                      <div className="cart-item__variants">
                        {item.selectedSize && (
                          <span className="cart-item__variant">
                            Size: <strong>{item.selectedSize}</strong>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="cart-item__variant">
                            Màu: <strong>{item.selectedColor}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="cart-item__price" data-label="Đơn giá">
                    <span>{formatPrice(unitPrice)}</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="cart-item__qty" data-label="Số lượng">
                    <div className="cart-item__qty-controls">
                      <button
                        type="button"
                        className="cart-item__qty-btn"
                        onClick={() => handleUpdateQuantity(
                          item.id, item.selectedSize, item.selectedColor,
                          (item.quantity || 1) - 1
                        )}
                        disabled={(item.quantity || 1) <= 1}
                        aria-label="Giảm số lượng"
                      >
                        <MinusIcon />
                      </button>
                      <span className="cart-item__qty-value">{item.quantity || 1}</span>
                      <button
                        type="button"
                        className="cart-item__qty-btn"
                        onClick={() => handleUpdateQuantity(
                          item.id, item.selectedSize, item.selectedColor,
                          (item.quantity || 1) + 1
                        )}
                        aria-label="Tăng số lượng"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="cart-item__total" data-label="Thành tiền">
                    <span className="cart-item__total-price">{formatPrice(lineTotal)}</span>
                  </div>

                  {/* Remove button */}
                  <div className="cart-item__action">
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => handleRemoveItem(
                        item.id, item.selectedSize, item.selectedColor
                      )}
                      aria-label={`Xóa ${item.name}`}
                      title="Xóa sản phẩm"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom actions */}
            <div className="cart-items__footer">
              <a href="/new-arrivals" className="cart-footer__continue">
                ← Tiếp tục mua sắm
              </a>
              <button
                type="button"
                className="cart-footer__clear"
                onClick={handleClearCart}
              >
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary (Sticky) ── */}
          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <h2 className="cart-summary__title">Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div className="cart-summary__coupon">
                <div className="cart-summary__coupon-row">
                  <TagIcon />
                  <input
                    type="text"
                    className="cart-summary__coupon-input"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    type="button"
                    className="cart-summary__coupon-btn"
                    onClick={handleApplyCoupon}
                  >
                    Áp dụng
                  </button>
                </div>
                {couponMsg && (
                  <p className="cart-summary__coupon-msg">{couponMsg}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="cart-summary__lines">
                <div className="cart-summary__line">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary__line">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'cart-summary__free' : ''}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="cart-summary__ship-note">
                    Miễn phí vận chuyển cho đơn từ {formatPrice(500000)}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="cart-summary__total">
                <span>Tổng cộng</span>
                <span className="cart-summary__total-price">{formatPrice(totalPrice)}</span>
              </div>

              {/* Checkout button */}
              <a href="/checkout" className="btn-checkout cart-summary__checkout" id="checkout-btn">
                TIẾN HÀNH THANH TOÁN
              </a>

              {/* Trust badges */}
              <div className="cart-summary__trust">
                <div className="cart-summary__trust-item">
                  <ShieldIcon />
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="cart-summary__trust-item">
                  <TruckIcon />
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
