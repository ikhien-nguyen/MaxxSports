import React, { useState, useEffect, useRef } from 'react';
import { categoryProducts } from '../../data/categoryData';
import { formatPrice } from '../../data/productDetailData';
import './Header.css';

/* ── Nav data ──────────────────────────────────────────────── */
const sportsCategories = [
  { label: 'Pickleball', href: '/sport/pickleball' },
  { label: 'Cầu lông',   href: '/sport/cau-long' },
  { label: 'Bóng đá',    href: '/sport/bong-da' },
  { label: 'Chạy bộ',    href: '/sport/chay-bo' },
  { label: 'Tennis',     href: '/sport/tennis' },
  { label: 'Bóng rổ',    href: '/sport/bong-ro' },
  { label: 'Golf',       href: '/sport/golf' },
];

const navLinks = [
  { label: 'THƯƠNG HIỆU', href: '/category' },
  { label: 'SẢN PHẨM MỚI', href: '/new-arrivals' },
  { label: 'NAM', href: '/nam' },
  { label: 'NỮ', href: '/nu' },
  { label: 'TRẺ EM', href: '/tre-em' },
  { label: 'OUTLET', href: '/outlet', highlight: true },
  { label: 'CỬA HÀNG', href: '/category' },
];

const mobileNavLinks = [
  { label: 'THƯƠNG HIỆU', href: '/category' },
  { label: 'MÔN THỂ THAO', href: '/category' },
  { label: 'SẢN PHẨM MỚI', href: '/new-arrivals' },
  { label: 'NAM', href: '/nam' },
  { label: 'NỮ', href: '/nu' },
  { label: 'TRẺ EM', href: '/tre-em' },
  { label: 'OUTLET', href: '/outlet', highlight: true },
  { label: 'CỬA HÀNG', href: '/category' },
];

/* ── Inline SVG icons ──────────────────────────────────────── */
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Brand Logo Component ────────────────────────────────────── */
const XSportLogo = () => (
  <div className="xsport-brand-logo">
    <span className="xsport-x">
      X
      <span className="xsport-x-slash"></span>
    </span>
    <span className="xsport-text">SPORT</span>
  </div>
);

/* Small caret for dropdown trigger */
const CaretDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" className="caret-icon" aria-hidden="true">
    <polyline points="2 3 5 7 8 3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ── Helper: parse price from string like "1.050.000₫" → number ── */
function parseNumericPrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
  }
  return 0;
}

/* ── Component ──────────────────────────────────────────────── */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  /* ── SEARCH STATE ──────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  /* ── Load user from localStorage on mount ──────────────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xsport_user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  /* ── Real-time cart badge sync ──────────────────────────────── */
  useEffect(() => {
    const updateBadge = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('xsport_cart') || '[]');
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalQty);
      } catch {
        setCartCount(0);
      }
    };
    updateBadge();
    window.addEventListener('cartUpdated', updateBadge);
    window.addEventListener('storage', updateBadge);
    return () => {
      window.removeEventListener('cartUpdated', updateBadge);
      window.removeEventListener('storage', updateBadge);
    };
  }, []);

  /* ── Close user dropdown on outside click ─────────────────── */
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.user-dropdown-wrap')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userDropdownOpen]);

  /* ── Close search dropdown on outside click ───────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── SEARCH ALGORITHM: Imperative filter on every keystroke ── */
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    /* 1. Fetch products from localStorage (future backend)
       Fallback to static categoryProducts from data file */
    let allProducts = [];
    try {
      const stored = localStorage.getItem('xsport_products');
      if (stored) {
        allProducts = JSON.parse(stored);
      }
    } catch { /* ignore */ }

    /* If localStorage is empty, use imported static data */
    if (allProducts.length === 0) {
      allProducts = categoryProducts;
    }

    /* 2. Imperative filter: name.toLowerCase().includes(query) */
    const matched = [];
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      if (product.name && product.name.toLowerCase().includes(query)) {
        matched.push(product);
      }
      /* 3. Limit to Top 5 */
      if (matched.length >= 5) break;
    }

    setSuggestions(matched);
  }, [searchQuery]);

  /* ── Handle suggestion click → navigate ────────────────────── */
  const handleSuggestionClick = (product) => {
    setSearchQuery('');
    setSuggestions([]);
    setIsFocused(false);
    window.location.href = `/product/${product.id}`;
  };

  /* ── Logout handler: backup cart → clear → remove user ────── */
  const handleLogout = () => {
    if (currentUser?.email) {
      try {
        const currentCart = localStorage.getItem('xsport_cart') || '[]';
        localStorage.setItem(`saved_cart_${currentUser.email}`, currentCart);
      } catch { /* ignore */ }
    }

    localStorage.setItem('xsport_cart', '[]');
    localStorage.removeItem('xsport_user');
    window.dispatchEvent(new Event('cartUpdated'));

    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  /* Show dropdown if focused AND (has query text) */
  const showSuggestions = isFocused && searchQuery.trim().length > 0;

  return (
    <header className="header-outer">
      {/* ── Desktop bar ── */}
      <div className="header-inner">

        {/* LEFT ZONE — Logo */}
        <div className="header-left">
          <a href="/" aria-label="Trang chủ XSPORT" className="header-logo-link">
            <XSportLogo />
          </a>
        </div>

        {/* CENTER ZONE — Nav */}
        <nav className="header-center" aria-label="Điều hướng chính">
          <ul className="nav-list">

            {/* THƯƠNG HIỆU */}
            <li className="nav-list-item">
              <a href="/category" className="nav-link">THƯƠNG HIỆU</a>
            </li>

            {/* MÔN THỂ THAO — dropdown */}
            <li className="nav-list-item nav-has-dropdown">
              <a href="/category" className="nav-link dropdown-trigger">
                MÔN THỂ THAO
                <CaretDown />
              </a>
              <ul className="dropdown-menu" role="menu">
                {sportsCategories.map((cat) => (
                  <li key={cat.href} role="none">
                    <a
                      href={cat.href}
                      role="menuitem"
                      className="dropdown-item"
                    >
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* Remaining nav items */}
            {navLinks.slice(1).map((link) => (
              <li key={link.label} className="nav-list-item">
                <a
                  href={link.href}
                  className={`nav-link${link.highlight ? ' nav-link--outlet' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}

          </ul>
        </nav>

        {/* RIGHT ZONE — Actions */}
        <div className="header-right">
          {/* Search pill with auto-suggest */}
          <div className="search-pill" ref={searchRef} id="header-search">
            <span className="search-icon-wrap">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Tìm kiếm sản phẩm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              id="search-input"
              autoComplete="off"
            />

            {/* ── Search Suggestions Dropdown ── */}
            {showSuggestions && (
              <div className="search-dropdown" id="search-suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((product) => {
                    const numericPrice = parseNumericPrice(product.price || product.currentPrice || 0);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        className="search-dropdown__item"
                        onClick={() => handleSuggestionClick(product)}
                        id={`suggestion-${product.id}`}
                      >
                        <div className="search-dropdown__thumb">
                          <img
                            src={product.image || 'https://placehold.co/60x60/f5f5f5/999?text=SP'}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => { e.target.src = 'https://placehold.co/60x60/f5f5f5/999?text=SP'; }}
                          />
                        </div>
                        <div className="search-dropdown__info">
                          <span className="search-dropdown__name">{product.name}</span>
                          <span className="search-dropdown__price">
                            {numericPrice > 0 ? formatPrice(numericPrice) : (product.price || product.currentPrice || '')}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="search-dropdown__empty" id="search-no-results">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="8" y1="8" x2="14" y2="14" />
                    </svg>
                    <span>Không tìm thấy sản phẩm</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User — Auth-aware dropdown or link */}
          {currentUser ? (
            <div className="user-dropdown-wrap">
              <button
                type="button"
                className="icon-btn user-icon-link user-icon-link--logged"
                title={`Xin chào, ${currentUser.name || 'User'}`}
                aria-label={`Menu tài khoản — ${currentUser.name || 'User'}`}
                aria-expanded={userDropdownOpen}
                onClick={() => setUserDropdownOpen((v) => !v)}
                id="user-menu-trigger"
              >
                <UserIcon />
                <span className="user-logged-dot" aria-hidden="true" />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown" id="user-dropdown-menu">
                  <div className="user-dropdown__header">
                    <div className="user-dropdown__avatar">
                      {(currentUser.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-dropdown__info">
                      <span className="user-dropdown__name">{currentUser.name || 'User'}</span>
                      <span className="user-dropdown__email">{currentUser.email}</span>
                      <span className="user-dropdown__role">{currentUser.role}</span>
                    </div>
                  </div>
                  <div className="user-dropdown__divider" />
                  {currentUser.role === 'ADMIN' ? (
                    <a href="/admin" className="user-dropdown__link" id="dropdown-admin-link">
                      <UserIcon />
                      Bảng điều khiển Admin
                    </a>
                  ) : (
                    <a href="/account" className="user-dropdown__link" id="dropdown-account-link">
                      <UserIcon />
                      Tài khoản của tôi
                    </a>
                  )}
                  <div className="user-dropdown__divider" />
                  <button
                    type="button"
                    className="user-dropdown__logout"
                    onClick={handleLogout}
                    id="logout-btn"
                  >
                    <LogoutIcon />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/auth" className="icon-btn user-icon-link" title="Tài khoản" aria-label="Tài khoản">
              <UserIcon />
            </a>
          )}

          {/* Cart — links to /cart */}
          {currentUser?.role !== 'ADMIN' && (
          <a
            href="/cart"
            className="icon-btn cart-btn"
            title="Giỏ hàng"
            aria-label={`Giỏ hàng — ${cartCount} sản phẩm`}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">{cartCount}</span>
            )}
          </a>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <nav
        id="mobile-nav"
        className={`mobile-nav${isMobileMenuOpen ? ' open' : ''}`}
        aria-label="Mobile menu"
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Mobile user info bar */}
        {currentUser && (
          <div className="mobile-nav-user">
            <div className="mobile-nav-user__avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="mobile-nav-user__info">
              <span className="mobile-nav-user__name">{currentUser.name}</span>
              <span className="mobile-nav-user__email">{currentUser.email}</span>
            </div>
          </div>
        )}

        {mobileNavLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`mobile-nav-item${link.highlight ? ' mobile-nav-item--outlet' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}

        <div className="mobile-nav-group">
          <span className="mobile-nav-item mobile-nav-group-title">MÔN THỂ THAO</span>
          {sportsCategories.map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              className="mobile-nav-sub"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Mobile logout */}
        {currentUser && (
          <button
            type="button"
            className="mobile-nav-logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
            Đăng xuất
          </button>
        )}
      </nav>
    </header>
  );
}
