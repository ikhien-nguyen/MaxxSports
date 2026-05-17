import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/* ── Inline SVG Icons ────────────────────────────────────────── */
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* Social SVG icons (inline, no external deps) */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

/* ── Footer Logo ─────────────────────────────────────────────── */
const FooterLogo = () => (
  <Link to="/" className="footer-brand-logo" aria-label="XSPORT Trang chủ">
    <span className="footer-brand-x">X</span>
    <span className="footer-brand-text">SPORT</span>
  </Link>
);

/* ── Policy links config ─────────────────────────────────────── */
const policyLinks = [
  { label: 'Chính sách đổi trả', to: '/chinh-sach-doi-tra' },
  { label: 'Chính sách bảo hành', to: '/chinh-sach-bao-hanh' },
  { label: 'Chính sách bảo mật', to: '/chinh-sach-bao-mat' },
  { label: 'Chính sách vận chuyển', to: '/chinh-sach-van-chuyen' },
  { label: 'Chính sách thanh toán', to: '/chinh-sach-thanh-toan' },
];

const supportLinks = [
  { label: 'Hướng dẫn mua hàng', to: '/huong-dan-mua-hang' },
  { label: 'Hướng dẫn chọn size', to: '/huong-dan-chon-size' },
  { label: 'Câu hỏi thường gặp', to: '/faq' },
  { label: 'Hệ thống cửa hàng', to: '/he-thong-cua-hang' },
  { label: 'Liên hệ', to: '/lien-he' },
];

/* ══════════════════════════════════════════════════════════════
   FOOTER COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribeMsg('✅ Đăng ký thành công! Cảm ơn bạn.');
    setEmail('');
    setTimeout(() => setSubscribeMsg(''), 5000);
  };

  return (
    <footer className="footer-outer" id="site-footer">

      {/* ── Main grid ── */}
      <div className="footer-grid-container">
        <div className="footer-grid">

          {/* ════════ COLUMN 1: ABOUT ════════ */}
          <div className="footer-col footer-col--about">
            <FooterLogo />
            <p className="footer-desc">
              Thương hiệu thể thao hàng đầu Việt Nam, phân phối chính hãng các sản phẩm
              adidas, Nike, Li-Ning, ASICS, 361° Sport và le coq sportif.
            </p>

            <ul className="footer-contact">
              <li className="footer-contact__item">
                <span className="footer-contact__icon"><MapPinIcon /></span>
                <span>CH2.2, Tầng 2, Tòa Handiresco, 31 Lê Văn Lương, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="footer-contact__item">
                <span className="footer-contact__icon"><PhoneIcon /></span>
                <span>
                  Hotline:{' '}
                  <a href="tel:1900633083" className="footer-link--inline">1900 633 083</a>
                </span>
              </li>
              <li className="footer-contact__item">
                <span className="footer-contact__icon"><MailIcon /></span>
                <span>
                  Email:{' '}
                  <a href="mailto:support@xsport.vn" className="footer-link--inline">support@xsport.vn</a>
                </span>
              </li>
            </ul>
          </div>

          {/* ════════ COLUMN 2: CHÍNH SÁCH ════════ */}
          <div className="footer-col">
            <h4 className="footer-col__title">CHÍNH SÁCH</h4>
            <ul className="footer-nav">
              {policyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-nav__link">
                    <ChevronRightIcon />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ════════ COLUMN 3: HỖ TRỢ ════════ */}
          <div className="footer-col">
            <h4 className="footer-col__title">HỖ TRỢ</h4>
            <ul className="footer-nav">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-nav__link">
                    <ChevronRightIcon />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ════════ COLUMN 4: NEWSLETTER ════════ */}
          <div className="footer-col footer-col--newsletter">
            <h4 className="footer-col__title">ĐĂNG KÝ NHẬN TIN</h4>
            <p className="footer-desc">
              Nhận thông tin ưu đãi độc quyền và cập nhật bộ sưu tập mới nhất từ XSPORT.
            </p>

            <form className="footer-subscribe" onSubmit={handleSubscribe} id="newsletter-form">
              <div className="footer-subscribe__input-wrap">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSubscribeMsg(''); }}
                  required
                  id="newsletter-email"
                  className="footer-subscribe__input"
                  autoComplete="email"
                />
                <button type="submit" className="footer-subscribe__btn" aria-label="Đăng ký nhận tin">
                  <SendIcon />
                </button>
              </div>
              {subscribeMsg && (
                <p className="footer-subscribe__msg">{subscribeMsg}</p>
              )}
            </form>

            {/* Social media icons */}
            <div className="footer-social">
              <span className="footer-social__label">Theo dõi chúng tôi</span>
              <div className="footer-social__icons">
                <a href="https://facebook.com" className="footer-social__link footer-social__link--fb" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                </a>
                <a href="https://instagram.com" className="footer-social__link footer-social__link--ig" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon />
                </a>
                <a href="https://youtube.com" className="footer-social__link footer-social__link--yt" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon />
                </a>
                <a href="https://tiktok.com" className="footer-social__link footer-social__link--tt" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                  <TiktokIcon />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p className="footer-copyright">
            © 2015–2026 <strong>XSPORT</strong>. All rights reserved. | MST: 0107139974
          </p>
          <div className="footer-bottom__badges">
            <span className="footer-badge">VISA</span>
            <span className="footer-badge">MasterCard</span>
            <span className="footer-badge footer-badge--accent">VNPAY</span>
            <span className="footer-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
