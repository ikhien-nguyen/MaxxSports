import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';
import {
  categoryProducts,
  BRANDS,
  PRODUCT_LINES,
  PRICE_RANGES,
  PRODUCT_TYPES,
  GENDERS,
  CLOTHING_SIZES,
  SHOE_SIZES,
  SORT_OPTIONS,
  formatVND,
} from '../../data/categoryData';

/* ── Constants ──────────────────────────────────────────────── */
const PRODUCTS_PER_PAGE = 12;

/* ── Inline SVG icons ───────────────────────────────────────── */
const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BoltIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
    <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── FilterSection wrapper ──────────────────────────────────── */
function FilterSection({ title, children, separator = true }) {
  return (
    <div className={`cp-filter-section${separator ? ' cp-filter-section--sep' : ''}`}>
      <h6 className="cp-filter-section__title">{title}</h6>
      {children}
    </div>
  );
}

/* ── Expandable checkbox list ───────────────────────────────── */
function ExpandableList({ items, limit = 5, renderItem }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className="cp-filter-list">
      {visible.map((item, i) => renderItem(item, i))}
      {hasMore && (
        <button
          type="button"
          className="cp-view-more"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <span>{expanded ? 'Thu gọn' : 'Xem thêm'}</span>
          <ChevronDownIcon className={expanded ? 'cp-chevron--up' : ''} />
        </button>
      )}
    </div>
  );
}

/* ── Product card ───────────────────────────────────────────── */
function CpProductCard({ product, onAddToCart }) {
  const { id, brand, name, price, image, dotColor } = product;

  return (
    <div className="cp-card">
      <Link
        to={`/product/${id}`}
        className="cp-card__link"
        aria-label={`${brand} — ${name}`}
      >
        <div className="cp-card__img-wrap">
          <img src={image} alt={name} className="cp-card__img" loading="lazy" />
        </div>
        <div className="cp-card__info">
          <span className="cp-card__brand">{brand}</span>
          <p className="cp-card__name">{name}</p>
          <p className="cp-card__price">{formatVND(price)}</p>
          <span
            className="cp-card__dot"
            style={{ backgroundColor: dotColor }}
            role="img"
            aria-label={`Màu sản phẩm`}
          />
        </div>
      </Link>

      <div className="cp-card__actions">
        <button
          type="button"
          className="cp-card__btn cp-card__btn--ghost"
          onClick={(e) => onAddToCart(e, product)}
          aria-label={`Thêm ${name} vào giỏ hàng`}
        >
          <CartIcon /> THÊM VÀO GIỎ
        </button>
        <button
          type="button"
          className="cp-card__btn cp-card__btn--primary"
          onClick={(e) => {
            e.preventDefault();
            const cartItem = { id, cartId: Date.now(), name, brand, price, image, quantity: 1 };
            const existing = JSON.parse(localStorage.getItem('xsport_cart') || '[]');
            localStorage.setItem('xsport_cart', JSON.stringify([...existing, cartItem]));
            window.dispatchEvent(new Event('cartUpdated'));
            window.location.href = '/cart';
          }}
          aria-label={`Mua ngay ${name}`}
        >
          <BoltIcon /> MUA NGAY
        </button>
      </div>
    </div>
  );
}

/* ── Pagination ─────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const buildPages = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push('…');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="cp-pagination" aria-label="Phân trang sản phẩm">
      {buildPages().map((page, idx) =>
        page === '…' ? (
          <span key={`e-${idx}`} className="cp-pagination__ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`cp-pagination__item${
              page === currentPage ? ' cp-pagination__item--active' : ''
            }`}
            onClick={() => onPageChange(page)}
            aria-label={`Trang ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}
      {currentPage < totalPages && (
        <button
          type="button"
          className="cp-pagination__next"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Trang tiếp theo"
        >
          <ChevronRightIcon />
        </button>
      )}
    </nav>
  );
}

/* ── CategoryPage ───────────────────────────────────────────── */
export default function CategoryPage({ categoryType = 'all', categoryValue = '', pageTitle = 'SẢN PHẨM' }) {
  const [filters, setFilters] = useState({
    brands: [],
    productLines: [],
    priceRanges: [],
    productTypes: [],
    genders: [],
    clothingSizes: [],
    shoeSizes: [],
  });
  const [sortType, setSortType] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Close sidebar on desktop resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 992) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Lock body scroll when sidebar open on mobile */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  /* Toggle filter value */
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => {
      const cur = prev[filterKey];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [filterKey]: next };
    });
    setCurrentPage(1);
  };

  const isActive = (filterKey, value) => filters[filterKey].includes(value);

  /* Add to cart with localStorage persistence */
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    const existingCart = JSON.parse(localStorage.getItem('xsport_cart') || '[]');
    localStorage.setItem(
      'xsport_cart',
      JSON.stringify([...existingCart, product])
    );
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Đã thêm ' + product.name + ' vào giỏ hàng!');
  };

  /* Filter + sort logic */
  const filteredProducts = useMemo(() => {
    /* Step 1: Pre-filter by category route */
    let result = [...categoryProducts];
    if (categoryType === 'gender') {
      result = result.filter((p) => p.gender === categoryValue);
    } else if (categoryType === 'sport') {
      result = result.filter((p) => p.sportType === categoryValue);
    } else if (categoryType === 'status' && categoryValue === 'new') {
      result = result.filter((p) => p.isNew);
    } else if (categoryType === 'status' && categoryValue === 'outlet') {
      result = result.filter((p) => p.isOutlet);
    }

    /* Step 2: Apply sidebar filters */

    if (filters.brands.length) {
      result = result.filter((p) =>
        filters.brands.some((b) => p.brand.toLowerCase() === b.toLowerCase())
      );
    }
    if (filters.productLines.length) {
      result = result.filter((p) =>
        p.productLines.some((l) => filters.productLines.includes(l))
      );
    }
    if (filters.priceRanges.length) {
      result = result.filter((p) =>
        filters.priceRanges.some((label) => {
          const range = PRICE_RANGES.find((r) => r.label === label);
          return range && p.price >= range.min && p.price <= range.max;
        })
      );
    }
    if (filters.productTypes.length) {
      result = result.filter((p) => filters.productTypes.includes(p.productType));
    }
    if (filters.genders.length) {
      result = result.filter((p) =>
        p.genders.some((g) => filters.genders.includes(g))
      );
    }
    if (filters.clothingSizes.length) {
      result = result.filter((p) =>
        p.clothingSizes.some((s) => filters.clothingSizes.includes(s))
      );
    }
    if (filters.shoeSizes.length) {
      result = result.filter((p) =>
        p.shoeSizes.some((s) => filters.shoeSizes.includes(s))
      );
    }

    if (sortType === 'price-asc')
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortType === 'price-desc')
      result = [...result].sort((a, b) => b.price - a.price);
    else if (sortType === 'name-asc')
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    return result;
  }, [filters, sortType, categoryType, categoryValue]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="category-page">
      {/* ── Breadcrumb ─── */}
      <div className="cp-container">
        <nav className="cp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="cp-breadcrumb__link">
            Trang chủ
          </Link>
          <span className="cp-breadcrumb__sep" aria-hidden="true"> / </span>
          <span className="cp-breadcrumb__current">{pageTitle}</span>
        </nav>
      </div>

      {/* ── Page header ─── */}
      <div className="cp-container">
        <div className="cp-head">
          <h1 className="cp-title">{pageTitle}</h1>
          <div className="cp-sort">
            <label htmlFor="cp-sort-select" className="cp-sort__label">
              Sắp xếp:
            </label>
            <div className="cp-sort__select-wrap">
              <select
                id="cp-sort-select"
                className="cp-sort__select"
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="cp-sort__arrow" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─── */}
      <div className="cp-container">
        {/* Mobile filter toggle button */}
        <button
          type="button"
          className="cp-filter-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Mở bộ lọc sản phẩm"
          aria-expanded={sidebarOpen}
        >
          <FilterIcon />
          Lọc sản phẩm
        </button>

        <div className="cp-body">
          {/* Backdrop */}
          {sidebarOpen && (
            <div
              className="cp-sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ── Sidebar ─── */}
          <aside
            className={`cp-sidebar${sidebarOpen ? ' cp-sidebar--open' : ''}`}
            aria-label="Bộ lọc sản phẩm"
          >
            {/* Mobile sidebar header */}
            <div className="cp-sidebar__mobile-head">
              <span>Bộ lọc</span>
              <button
                type="button"
                className="cp-sidebar__close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Đóng bộ lọc"
              >
                <CloseIcon />
              </button>
            </div>

            {/* THƯƠNG HIỆU */}
            <FilterSection title="Thương hiệu" separator={false}>
              <ExpandableList
                items={BRANDS}
                renderItem={(brand) => (
                  <label key={brand} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden"
                      checked={isActive('brands', brand)}
                      onChange={() => handleFilterChange('brands', brand)}
                      aria-label={brand}
                    />
                    <span className="cp-chk-box" aria-hidden="true" />
                    <span className="cp-filter-item__label">{brand}</span>
                  </label>
                )}
              />
            </FilterSection>

            {/* DÒNG SẢN PHẨM */}
            <FilterSection title="Dòng sản phẩm">
              <ExpandableList
                items={PRODUCT_LINES}
                renderItem={(line) => (
                  <button
                    key={line.id}
                    type="button"
                    className={`cp-filter-sport-item${
                      isActive('productLines', line.id) ? ' is-active' : ''
                    }`}
                    onClick={() => handleFilterChange('productLines', line.id)}
                    role="checkbox"
                    aria-checked={isActive('productLines', line.id)}
                  >
                    {line.icon ? (
                      <img
                        src={line.icon}
                        alt=""
                        className="cp-filter-sport-icon"
                        aria-hidden="true"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="cp-filter-sport-icon cp-filter-sport-icon--placeholder" aria-hidden="true" />
                    )}
                    <span className="cp-filter-item__label">{line.label}</span>
                  </button>
                )}
              />
            </FilterSection>

            {/* MỨC GIÁ */}
            <FilterSection title="Mức giá">
              <div className="cp-filter-list">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden"
                      checked={isActive('priceRanges', range.label)}
                      onChange={() => handleFilterChange('priceRanges', range.label)}
                      aria-label={range.label}
                    />
                    <span className="cp-chk-box" aria-hidden="true" />
                    <span className="cp-filter-item__label">{range.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* LOẠI SẢN PHẨM */}
            <FilterSection title="Loại sản phẩm">
              <ExpandableList
                items={PRODUCT_TYPES}
                renderItem={(type) => (
                  <label key={type} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden"
                      checked={isActive('productTypes', type)}
                      onChange={() => handleFilterChange('productTypes', type)}
                      aria-label={type}
                    />
                    <span className="cp-chk-box" aria-hidden="true" />
                    <span className="cp-filter-item__label">{type}</span>
                  </label>
                )}
              />
            </FilterSection>

            {/* GIỚI TÍNH */}
            <FilterSection title="Giới tính">
              <div className="cp-filter-list">
                {GENDERS.map((gender) => (
                  <label key={gender} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden cp-chk-hidden--sm"
                      checked={isActive('genders', gender)}
                      onChange={() => handleFilterChange('genders', gender)}
                      aria-label={gender}
                    />
                    <span className="cp-chk-box cp-chk-box--sm" aria-hidden="true" />
                    <span className="cp-filter-item__label">{gender}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* KÍCH CỠ QUẦN ÁO */}
            <FilterSection title="Kích cỡ quần áo">
              <div className="cp-filter-list">
                {CLOTHING_SIZES.map((size) => (
                  <label key={size} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden cp-chk-hidden--sm"
                      checked={isActive('clothingSizes', size)}
                      onChange={() => handleFilterChange('clothingSizes', size)}
                      aria-label={`Cỡ ${size}`}
                    />
                    <span className="cp-chk-box cp-chk-box--sm" aria-hidden="true" />
                    <span className="cp-filter-item__label">{size}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* KÍCH CỠ GIÀY DÉP */}
            <FilterSection title="Kích cỡ giày dép">
              <div className="cp-filter-list">
                {SHOE_SIZES.map((size) => (
                  <label key={size} className="cp-filter-item">
                    <input
                      type="checkbox"
                      className="cp-chk-hidden cp-chk-hidden--sm"
                      checked={isActive('shoeSizes', size)}
                      onChange={() => handleFilterChange('shoeSizes', size)}
                      aria-label={`Size ${size}`}
                    />
                    <span className="cp-chk-box cp-chk-box--sm" aria-hidden="true" />
                    <span className="cp-filter-item__label">{size}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* ── Product main area ─── */}
          <div className="cp-main">
            {/* Result count */}
            <p className="cp-result-count">
              {filteredProducts.length} sản phẩm
            </p>

            {paginatedProducts.length > 0 ? (
              <div className="cp-product-grid">
                {paginatedProducts.map((product) => (
                  <CpProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="cp-no-results">
                <p>Không tìm thấy sản phẩm phù hợp.</p>
                <button
                  type="button"
                  className="cp-clear-filters"
                  onClick={() =>
                    setFilters({
                      brands: [], productLines: [], priceRanges: [],
                      productTypes: [], genders: [], clothingSizes: [], shoeSizes: [],
                    })
                  }
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
