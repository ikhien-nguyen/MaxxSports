import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/productDetailData';
import './Success.css';

/* ── Inline SVG Icons ──────────────────────────────────────── */
const CheckCircleLarge = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="36" stroke="#28a745" strokeWidth="3" fill="none" />
    <circle cx="40" cy="40" r="30" fill="#28a745" opacity="0.08" />
    <path d="M26 40l10 10 18-20" stroke="#28a745" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const MailOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h9" />
    <polyline points="22,6 12,13 2,6" />
    <circle cx="19" cy="19" r="3" />
    <line x1="19" y1="17" x2="19" y2="19.5" />
    <line x1="19" y1="21" x2="19.01" y2="21" />
  </svg>
);

const OrderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

/* ── SUCCESS PAGE COMPONENT ────────────────────────────────── */
export default function Success() {
  /* ── Read last order from localStorage ── */
  const [order] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('xsport_last_order')) || null;
    } catch { return null; }
  });

  /* ── Fallback order number if no real order ── */
  const orderNumber = order?.id || ('MXS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase());

  /* ── On mount: ensure cart is clear + dispatch events ── */
  useEffect(() => {
    localStorage.setItem('xsport_cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('systemDataUpdated'));
  }, []);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">

          {/* ── Animated check icon ── */}
          <div className="success-icon" id="success-icon">
            <CheckCircleLarge />
          </div>

          {/* ── Title ── */}
          <h1 className="success-title" id="success-page-title">
            ĐẶT HÀNG THÀNH CÔNG!
          </h1>

          {/* ── Subtitle ── */}
          <p className="success-subtitle">
            Cảm ơn bạn đã mua sắm tại <strong>Xsport</strong>. Đơn hàng của bạn đã được tiếp nhận
            và đang được xử lý.
          </p>

          {/* ── Order info card ── */}
          <div className="success-order-info" id="success-order-info">
            <div className="success-order-row">
              <span className="success-order-label">Mã đơn hàng</span>
              <span className="success-order-value success-order-value--highlight">{orderNumber}</span>
            </div>
            <div className="success-order-row">
              <span className="success-order-label">Trạng thái</span>
              <span className="success-order-status">
                <span className="success-status-dot" />
                {order?.status || 'Đang xử lý'}
              </span>
            </div>
            {order?.total && (
              <div className="success-order-row">
                <span className="success-order-label">Tổng thanh toán</span>
                <span className="success-order-value" style={{ color: '#df0000', fontWeight: 800 }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            )}
            {order?.payment && (
              <div className="success-order-row">
                <span className="success-order-label"><CreditCardIcon /> Thanh toán</span>
                <span className="success-order-value">{order.payment}</span>
              </div>
            )}
            {order?.shipping?.address && (
              <div className="success-order-row">
                <span className="success-order-label"><MapPinIcon /> Giao đến</span>
                <span className="success-order-value" style={{ maxWidth: 280, textAlign: 'right' }}>{order.shipping.address}</span>
              </div>
            )}
            <div className="success-order-row">
              <span className="success-order-label">Thời gian dự kiến</span>
              <span className="success-order-value">2-5 ngày làm việc</span>
            </div>
          </div>

          {/* ── Order items mini list ── */}
          {order?.items && order.items.length > 0 && (
            <div className="success-items-summary" id="success-items-list">
              <h4 className="success-items-title"><OrderIcon /> Sản phẩm đã đặt</h4>
              {order.items.map((item, i) => (
                <div className="success-item-row" key={i}>
                  <span className="success-item-name">{item.name}</span>
                  <span className="success-item-meta">x{item.qty} — {formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Email notice ── */}
          <div className="success-notice">
            <MailOpenIcon />
            <p>
              Email xác nhận đơn hàng đã được gửi đến hộp thư của bạn.
              Vui lòng kiểm tra email để theo dõi trạng thái đơn hàng.
            </p>
          </div>

          {/* ── Action buttons ── */}
          <div className="success-actions">
            <Link to="/" className="success-btn success-btn--primary" id="success-home-btn">
              <HomeIcon />
              Về trang chủ
            </Link>
            <Link to="/account" className="success-btn success-btn--secondary" id="success-orders-btn">
              <OrderIcon />
              Xem đơn hàng
            </Link>
          </div>

          {/* ── Support line ── */}
          <p className="success-support">
            Cần hỗ trợ? Liên hệ hotline{' '}
            <a href="tel:19001234" className="success-support__link">1900 1234</a>
            {' '}hoặc email{' '}
            <a href="mailto:support@xsport.com.vn" className="success-support__link">
              support@xsport.com.vn
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
