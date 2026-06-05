import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Category.css';
import { productService } from '../../services/productService';
import { convertBackendProduct } from '../Home/Home';
import {
  PRICE_RANGES,
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
            <img
                src={product.image}
                alt={product.name}
                className="cp-card__img"
                onError={(e)=>console.log(product)}
            />
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
  const { slug } = useParams();

  const [filters, setFilters] = useState({
    brands: [],
    priceRanges: [],
    productTypes: [],
  });

  const [sortType, setSortType] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* TẠO BỘ LỌC ĐỘNG TỪ DỮ LIỆU API */
  const dynamicBrands = useMemo(() => {
    if (!products || products.length === 0) return [];
    const allBrands = products.map(p => p.brand).filter(Boolean);
    return [...new Set(allBrands)].sort();
  }, [products]);

  const dynamicProductTypes = useMemo(() => {
    if (!products || products.length === 0) return [];
    const allTypes = products.map(p => p.productType).filter(Boolean);
    return [...new Set(allTypes)].sort();
  }, [products]);

  /* XỬ LÝ TIÊU ĐỀ: TÌM TÊN TIẾNG VIỆT TỪ SẢN PHẨM ĐÃ LOAD */
  const displayTitle = useMemo(() => {
    if (!slug) return pageTitle;
    if (loading) return "ĐANG TẢI...";

    const toSlug = (str) => {
      if (!str) return '';
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    };

    const matchedProduct = products.find(p => toSlug(p.productType) === slug);
    if (matchedProduct && matchedProduct.productType) {
      return matchedProduct.productType.toUpperCase();
    }

    return slug.replace(/-/g, ' ').toUpperCase();
  }, [slug, pageTitle, products, loading]);

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

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        const formatted = data.map(convertBackendProduct);
        setProducts(formatted);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

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
    let result = [...products];
    if (slug) {
      const toSlug = (str) => {
        if (!str) return '';
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      };

      result = result.filter((p) => toSlug(p.productType) === slug);
    }
    else if (categoryType === 'gender') {
      result = result.filter((p) => p.gender === categoryValue);
    } else if (categoryType === 'sport') {
      result = result.filter((p) => p.sportType === categoryValue);
    } else if (categoryType === 'status' && categoryValue === 'new') {
      result = result.filter((p) => p.isNew);
    } else if (categoryType === 'status' && categoryValue === 'outlet') {
      result = result.filter((p) => p.isOutlet);
    }

    if (filters.brands.length) {
      result = result.filter((p) =>
          filters.brands.some((b) => p.brand.toLowerCase() === b.toLowerCase())
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

    if (sortType === 'price-asc')
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortType === 'price-desc')
      result = [...result].sort((a, b) => b.price - a.price);
    else if (sortType === 'name-asc')
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    return result;
  }, [products, filters, sortType, categoryType, categoryValue, slug]);

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
        <div className="cp-container">
          <nav className="cp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="cp-breadcrumb__link">
              Trang chủ
            </Link>
            <span className="cp-breadcrumb__sep" aria-hidden="true"> / </span>
            <span className="cp-breadcrumb__current">{displayTitle}</span>
          </nav>
        </div>

        <div className="cp-container">
          <div className="cp-head">
            <h1 className="cp-title">{displayTitle}</h1>
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

        <div className="cp-container">
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
            {sidebarOpen && (
                <div
                    className="cp-sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`cp-sidebar${sidebarOpen ? ' cp-sidebar--open' : ''}`}
                aria-label="Bộ lọc sản phẩm"
            >
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

              {/* SỬ DỤNG DỮ LIỆU ĐỘNG: dynamicBrands */}
              <FilterSection title="Thương hiệu" separator={false}>
                <ExpandableList
                    items={dynamicBrands}
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

              {/* MỨC GIÁ: Vẫn giữ tĩnh */}
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

              {/* SỬ DỤNG DỮ LIỆU ĐỘNG: dynamicProductTypes */}
              <FilterSection title="Loại sản phẩm">
                <ExpandableList
                    items={dynamicProductTypes}
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

            </aside>

            <div className="cp-main">
              <p className="cp-result-count">
                {loading ? 'Đang cập nhật dữ liệu...' : `${filteredProducts.length} sản phẩm`}
              </p>

              {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#666', width: '100%' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p style={{ marginTop: '16px', fontSize: '1.1rem' }}>Đang tải sản phẩm, bạn chờ một chút nhé...</p>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                  </div>
              ) : paginatedProducts.length > 0 ? (
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
                              brands: [], priceRanges: [], productTypes: [],
                            })
                        }
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
              )}

              {!loading && (
                  <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
  );
}