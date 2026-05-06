import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productDetailDatabase, formatPrice } from '../../data/productDetailData';
import { categoryProducts } from '../../data/categoryData';
import {
  newArrivalsProducts,
  batMoodProducts,
  trendingProducts,
} from '../../data/homeData';
import './Product.css';

/* ── Flatten all homepage products into one array ─────────── */
const allHomeProducts = [
  ...Object.values(newArrivalsProducts).flat(),
  ...Object.values(batMoodProducts).flat(),
  ...Object.values(trendingProducts).flat(),
];

/* ── Helper: convert a categoryData product to detail format ── */
function toCategoryDetail(cp) {
  if (!cp) return null;
  const sizes = cp.shoeSizes.length ? cp.shoeSizes : cp.clothingSizes;
  return {
    id: cp.id,
    name: cp.name,
    sku: cp.id.toUpperCase(),
    brand: cp.brand,
    price: cp.price,
    oldPrice: cp.isOutlet ? Math.round(cp.price * 1.25) : null,
    images: [cp.image],
    availableColors: [{ name: 'Mặc định', hex: cp.dotColor }],
    availableSizes: sizes,
    category: cp.isNew ? 'SPORTSWEAR NEW ARRIVALS' : 'SPORTSWEAR',
    productType: cp.productType,
    gender: cp.genders.join(', '),
    description: `
      <h3>${cp.name}</h3>
      <p>Sản phẩm ${cp.productType.toLowerCase()} chính hãng ${cp.brand}, phù hợp cho ${cp.genders.join(', ').toLowerCase()}. Thiết kế hiện đại, chất liệu cao cấp mang đến sự thoải mái và phong cách.</p>
      <h4>Đặc điểm nổi bật:</h4>
      <ul>
        <li><strong>Thương hiệu:</strong> ${cp.brand} chính hãng 100%</li>
        <li><strong>Loại sản phẩm:</strong> ${cp.productType}</li>
        <li><strong>Giới tính:</strong> ${cp.genders.join(', ')}</li>
        <li><strong>Chất liệu:</strong> Cao cấp, bền bỉ, thoáng khí</li>
      </ul>
      <h4>Thông tin sản phẩm:</h4>
      <ul>
        <li>Mã sản phẩm: ${cp.id.toUpperCase()}</li>
        <li>Bảo hành: 6 tháng chính hãng</li>
      </ul>
    `,
    isNew: cp.isNew,
    _source: 'category',
    _sportType: cp.sportType,
    _productType: cp.productType,
  };
}

/* ── Helper: convert a homeData product to detail format ─── */
function toHomeDetail(hp) {
  if (!hp) return null;
  const priceStr = hp.price || hp.currentPrice || '0';
  const priceNum = parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
  const oldPriceStr = hp.originalPrice;
  const oldPriceNum = oldPriceStr ? parseInt(oldPriceStr.replace(/[^\d]/g, ''), 10) : null;
  const sku = hp.id.toUpperCase();
  const nameContainsSku = hp.name.toUpperCase().includes(sku);
  return {
    id: hp.id,
    name: hp.name,
    sku: sku,
    brand: hp.brand,
    price: priceNum,
    oldPrice: oldPriceNum,
    images: [hp.image],
    availableColors: [{ name: 'Mặc định', hex: hp.dotColor || '#333333' }],
    availableSizes: ['S', 'M', 'L', 'XL'],
    category: 'SPORTSWEAR',
    productType: 'Thể thao',
    gender: 'Unisex',
    description: `
      <h3>${hp.name}</h3>
      <p>Sản phẩm chính hãng ${hp.brand}. Thiết kế hiện đại, chất liệu cao cấp, phù hợp cho mọi hoạt động thể thao và đời thường.</p>
      <h4>Đặc điểm nổi bật:</h4>
      <ul>
        <li><strong>Thương hiệu:</strong> ${hp.brand} chính hãng 100%</li>
        <li><strong>Chất liệu:</strong> Cao cấp, thoáng khí</li>
        <li><strong>Mã sản phẩm:</strong> ${sku}</li>
      </ul>
    `,
    isNew: !hp.originalPrice,
    _source: 'home',
    _nameContainsSku: nameContainsSku,
  };
}

/* ── Inline SVG Icons ──────────────────────────────────────── */
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6h18M16 10a4 4 0 01-8 0"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZoomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Product Detail Page Component ─────────────────────────── */
export default function Product() {
  const { id } = useParams();

  /* ── Look up product: detail DB first, then category fallback ─ */
  const product = useMemo(() => {
    const detail = productDetailDatabase.find(
      (p) => String(p.id) === String(id)
    );
    if (detail) return detail;
    const cat = categoryProducts.find(
      (p) => String(p.id) === String(id)
    );
    if (cat) return toCategoryDetail(cat);
    const home = allHomeProducts.find(
      (p) => String(p.id) === String(id)
    );
    return toHomeDetail(home);
  }, [id]);

  /* ── Related products (same sport/type, exclude current) ──── */
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const srcCat = categoryProducts.find((p) => String(p.id) === String(id));
    if (!srcCat) return categoryProducts.slice(0, 5);
    return categoryProducts
      .filter((p) => p.id !== srcCat.id && (
        p.sportType === srcCat.sportType ||
        p.productType === srcCat.productType
      ))
      .slice(0, 5);
  }, [id, product]);

  /* ── State management ────────────────────────────────────── */
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Initialize defaults when product loads ──────────────── */
  useEffect(() => {
    if (product) {
      setSelectedColor(product.availableColors[0]);
      setSelectedSize(null);
      setQuantity(1);
      setMainImage(0);
      setAddedToCart(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 404 if product not found ────────────────────────────── */
  if (!product) {
    return (
      <div className="pd-not-found">
        <div className="pd-not-found__inner">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm với ID <strong>"{id}"</strong> không tồn tại trong hệ thống.</p>
          <Link to="/" className="pd-not-found__btn">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  /* ── Handlers ────────────────────────────────────────────── */
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn Kích cỡ!');
      return false;
    }

    const cartItem = {
      ...product,
      cartId: Date.now(),
      selectedSize,
      selectedColor: selectedColor?.name || product.availableColors[0].name,
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem('maxxsport_cart') || '[]');
    localStorage.setItem(
      'maxxsport_cart',
      JSON.stringify([...existingCart, cartItem])
    );
    window.dispatchEvent(new Event('cartUpdated'));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
    return true;
  };

  const handleBuyNow = () => {
    const added = handleAddToCart();
    if (added) {
      window.location.href = '/cart';
    }
  };

  const handleThumbnailClick = (index) => {
    setMainImage(index);
  };

  const handlePrevImage = () => {
    setMainImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setMainImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="product-detail">
      {/* ── Breadcrumb ── */}
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="pd-breadcrumb__link">Trang chủ</Link>
          <span className="pd-breadcrumb__sep" aria-hidden="true"> / </span>
          <Link to="/category" className="pd-breadcrumb__link">
            {product.category}
          </Link>
          <span className="pd-breadcrumb__sep" aria-hidden="true"> / </span>
          <span className="pd-breadcrumb__current">
            {product.name.includes(product.sku) ? product.name : `${product.name} - ${product.sku}`}
          </span>
        </nav>
      </div>

      {/* ── Product Top Section (2 columns) ── */}
      <div className="pd-container">
        <div className="pd-top">

          {/* ── LEFT: Image Gallery (Vertical thumbs + Main image) ── */}
          <div className="pd-gallery">
            {/* Vertical thumbnails (left side, Maxxsport style) */}
            {product.images.length > 1 && (
              <div className="pd-gallery__thumbs-col">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`pd-gallery__thumb${index === mainImage ? ' pd-gallery__thumb--active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    aria-label={`Xem ảnh ${index + 1}`}
                    aria-current={index === mainImage ? 'true' : undefined}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="pd-gallery__main-wrap">
              {product.isNew && (
                <span className="pd-badge pd-badge--new">NEW ARRIVAL</span>
              )}
              {discountPercent > 0 && (
                <span className="pd-badge pd-badge--sale">-{discountPercent}%</span>
              )}

              <img
                src={product.images[mainImage]}
                alt={`${product.name} - Ảnh ${mainImage + 1}`}
                className={`pd-gallery__main-img${isZoomed ? ' pd-gallery__main-img--zoomed' : ''}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Image navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pd-gallery__nav pd-gallery__nav--prev"
                    onClick={handlePrevImage}
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    className="pd-gallery__nav pd-gallery__nav--next"
                    onClick={handleNextImage}
                    aria-label="Ảnh tiếp theo"
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}

              <button
                type="button"
                className="pd-gallery__zoom"
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Phóng to ảnh"
              >
                <ZoomIcon />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="pd-info">
            <h1 className="pd-info__name">
              {product.name.includes(product.sku) ? product.name : `${product.name} - ${product.sku}`}
            </h1>

            {/* Brand & SKU */}
            <div className="pd-info__meta">
              <span className="pd-info__meta-label">Thương hiệu:</span>
              <span className="pd-info__meta-brand">{product.brand}</span>
              <span className="pd-info__meta-divider">|</span>
              <span className="pd-info__meta-label">Mã sản phẩm:</span>
              <span className="pd-info__meta-sku">{product.sku}</span>
            </div>

            {/* Price */}
            <div className="pd-info__price-block">
              <span className="pd-info__price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="pd-info__old-price">{formatPrice(product.oldPrice)}</span>
              )}
              {discountPercent > 0 && (
                <span className="pd-info__discount">-{discountPercent}%</span>
              )}
            </div>

            {/* Color selector */}
            <div className="pd-selector">
              <div className="pd-selector__header">
                <span className="pd-selector__label">Màu sắc:</span>
                <span className="pd-selector__value">{selectedColor?.name}</span>
              </div>
              <div className="pd-selector__options pd-selector__options--color">
                {product.availableColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`pd-color-btn${selectedColor?.name === color.name ? ' pd-color-btn--active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Chọn màu ${color.name}`}
                    aria-pressed={selectedColor?.name === color.name}
                    title={color.name}
                  >
                    <span
                      className="pd-color-btn__swatch"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor?.name === color.name && (
                      <span className="pd-color-btn__check">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="pd-selector">
              <div className="pd-selector__header">
                <span className="pd-selector__label">Kích cỡ:</span>
                <span className="pd-selector__value">
                  {selectedSize || 'Chưa chọn'}
                </span>
              </div>
              <div className="pd-selector__options pd-selector__options--size">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pd-size-btn${selectedSize === size ? ' pd-size-btn--active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Chọn size ${size}`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart row (Maxxsport style) */}
            <div className="pd-cart-row">
              <div className="pd-quantity__controls">
                <button
                  type="button"
                  className="pd-quantity__btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  <MinusIcon />
                </button>
                <span className="pd-quantity__value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="pd-quantity__btn"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="Tăng số lượng"
                >
                  <PlusIcon />
                </button>
              </div>
              <button
                type="button"
                className={`pd-actions__btn pd-actions__btn--outline${addedToCart ? ' pd-actions__btn--added' : ''}`}
                onClick={handleAddToCart}
                id="add-to-cart-btn"
              >
                {addedToCart ? 'ĐÃ THÊM VÀO GIỎ' : 'THÊM VÀO GIỎ'}
              </button>
            </div>

            {/* Buy Now — full width */}
            <div className="pd-actions">
              <button
                type="button"
                className="pd-actions__btn pd-actions__btn--primary"
                onClick={handleBuyNow}
                id="buy-now-btn"
              >
                MUA NGAY
              </button>
            </div>

            {/* Quick actions (share, wishlist) */}
            <div className="pd-quick-actions">
              <button type="button" className="pd-quick-action" aria-label="Chia sẻ sản phẩm">
                <ShareIcon />
                <span>Chia sẻ</span>
              </button>
              <button type="button" className="pd-quick-action" aria-label="Thêm vào yêu thích">
                <HeartIcon />
                <span>Yêu thích</span>
              </button>
            </div>

            {/* Shipping info */}
            <div className="pd-shipping">
              <div className="pd-shipping__item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8h4l3 4v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="pd-shipping__item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Nhận hàng tại cửa hàng</span>
              </div>
              <div className="pd-shipping__item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1 4v10l11 8 11-8V4L12 0 1 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 12l11-8M12 12L1 4M12 12v10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Đổi trả trong 30 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Tabs ── */}
      <div className="pd-container">
        <div className="pd-tabs">
          <div className="pd-tabs__header">
            <button
              type="button"
              className={`pd-tabs__tab${activeTab === 'description' ? ' pd-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('description')}
              aria-selected={activeTab === 'description'}
              role="tab"
            >
              Mô tả sản phẩm
            </button>
            <button
              type="button"
              className={`pd-tabs__tab${activeTab === 'return' ? ' pd-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('return')}
              aria-selected={activeTab === 'return'}
              role="tab"
            >
              Chính sách đổi trả
            </button>
            <button
              type="button"
              className={`pd-tabs__tab${activeTab === 'shipping' ? ' pd-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('shipping')}
              aria-selected={activeTab === 'shipping'}
              role="tab"
            >
              Chính sách giao hàng
            </button>
          </div>

          <div className="pd-tabs__content" role="tabpanel">
            {activeTab === 'description' && (
              <div
                className="pd-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {activeTab === 'return' && (
              <div className="pd-description">
                <h3>Chính sách đổi trả</h3>
                <p>MAXX SPORT cam kết đổi trả miễn phí trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng nếu sản phẩm đáp ứng các điều kiện sau:</p>
                <ul>
                  <li>Sản phẩm còn nguyên tem, mác, chưa qua sử dụng.</li>
                  <li>Sản phẩm không bị hư hỏng do lỗi từ phía khách hàng.</li>
                  <li>Có hóa đơn mua hàng hoặc mã đơn hàng.</li>
                  <li>Áp dụng đổi size hoặc đổi sản phẩm cùng giá trị hoặc cao hơn (bù tiền chênh lệch).</li>
                </ul>
                <p>Quý khách vui lòng liên hệ hotline <strong>1900 xxxx</strong> hoặc mang sản phẩm đến cửa hàng MAXX SPORT gần nhất để được hỗ trợ.</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="pd-description">
                <h3>Chính sách giao hàng</h3>
                <ul>
                  <li><strong>Nội thành Hà Nội & TP.HCM:</strong> Giao hàng trong 1-2 ngày làm việc.</li>
                  <li><strong>Các tỉnh thành khác:</strong> Giao hàng trong 3-5 ngày làm việc.</li>
                  <li><strong>Miễn phí giao hàng</strong> cho đơn hàng từ 500.000₫.</li>
                  <li>Phí giao hàng: 30.000₫ cho đơn dưới 500.000₫.</li>
                </ul>
                <p>Quý khách sẽ nhận được mã vận đơn và có thể theo dõi đơn hàng qua email sau khi đơn hàng được xác nhận.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Products Section ── */}
      {relatedProducts.length > 0 && (
        <div className="pd-container">
          <div className="pd-related">
            <h2 className="pd-related__title">Sản phẩm cùng phân khúc</h2>
            <div className="pd-related__grid">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="pd-related__card"
                >
                  <div className="pd-related__img-wrap">
                    {rp.isNew && <span className="pd-related__badge">NEW ARRIVAL</span>}
                    <img src={rp.image} alt={rp.name} className="pd-related__img" loading="lazy" />
                  </div>
                  <div className="pd-related__info">
                    <span className="pd-related__brand">{rp.brand.toUpperCase()}</span>
                    <p className="pd-related__name">{rp.name}</p>
                    <p className="pd-related__price">{formatPrice(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
