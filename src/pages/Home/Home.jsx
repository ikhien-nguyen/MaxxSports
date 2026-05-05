import { useState, useEffect, useCallback } from 'react'
import './Home.css'
import {
  heroSlides,
  lookbookBanners,
  newArrivalsTabs,
  newArrivalsProducts,
  batMoodTabs,
  batMoodProducts,
  sportCategories,
  trendingTabs,
  trendingProducts,
  blogPosts,
  promoPosts,
} from '../../data/homeData'

/* ─────────────────────────────────────────────
   INLINE SVG ICONS
───────────────────────────────────────────── */
const ChevronLeft = () => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
    <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
    <path d="M1 1L9 9L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRight = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path d="M1 5.5H10M10 5.5L6 1.5M10 5.5L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BoltIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ─────────────────────────────────────────────
   PRODUCT CARD — Dual Actions (New Arrivals / Trending)
───────────────────────────────────────────── */
function ProductCard({ brand, name, price, image, dotColor, href }) {
  return (
    <div className="product-card">
      <a className="product-card__link" href={href || '#redirect'} aria-label={`${brand} — ${name}`}>
        <div className="product-card__img-wrap">
          <img src={image} alt={name} className="product-card__img" loading="lazy" />
        </div>
        <div className="product-card__info">
          <span className="product-card__brand">{brand}</span>
          <p className="product-card__name">{name}</p>
          <p className="product-card__price">{price}</p>
          <span
            className="product-card__dot"
            style={{ backgroundColor: dotColor }}
            aria-label={`Màu sắc: ${dotColor}`}
          />
        </div>
      </a>
      <div className="action-buttons">
        <button
          className="action-btn action-btn--ghost"
          onClick={(e) => { e.preventDefault(); alert('Đã thêm sản phẩm ' + name + ' vào giỏ hàng!'); }}
          aria-label={`Thêm ${name} vào giỏ hàng`}
        >
          <CartIcon /> Thêm vào giỏ
        </button>
        <button
          className="action-btn action-btn--primary"
          onClick={(e) => { e.preventDefault(); alert('Chuyển hướng đến trang Thanh toán cho ' + name); }}
          aria-label={`Mua ngay ${name}`}
        >
          <BoltIcon /> Mua ngay
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SALE PRODUCT CARD — Dual Actions (BatMood section)
───────────────────────────────────────────── */
function SaleProductCard({ brand, name, currentPrice, originalPrice, discount, image, dotColor, href }) {
  return (
    <div className="product-card product-card--sale">
      <a className="product-card__link" href={href || '#redirect'} aria-label={`${brand} — ${name}`}>
        <div className="product-card__img-wrap">
          <img src={image} alt={name} className="product-card__img" loading="lazy" />
          {discount && <span className="product-card__discount-badge">{discount}</span>}
        </div>
        <div className="product-card__info">
          <span className="product-card__brand">{brand}</span>
          <p className="product-card__name">{name}</p>
          <div className="product-card__price-row">
            <span className="product-card__price">{currentPrice}</span>
            <span className="product-card__original-price">{originalPrice}</span>
          </div>
          <span
            className="product-card__dot"
            style={{ backgroundColor: dotColor }}
            aria-label={`Màu sắc: ${dotColor}`}
          />
        </div>
      </a>
      <div className="action-buttons">
        <button
          className="action-btn action-btn--ghost"
          onClick={(e) => { e.preventDefault(); alert('Đã thêm sản phẩm ' + name + ' vào giỏ hàng!'); }}
          aria-label={`Thêm ${name} vào giỏ hàng`}
        >
          <CartIcon /> Thêm vào giỏ
        </button>
        <button
          className="action-btn action-btn--primary"
          onClick={(e) => { e.preventDefault(); alert('Chuyển hướng đến trang Thanh toán cho ' + name); }}
          aria-label={`Mua ngay ${name}`}
        >
          <BoltIcon /> Mua ngay
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   View All Button
───────────────────────────────────────────── */
function ViewAllBtn({ href, label = 'Xem tất cả' }) {
  return (
    <div className="view-all-wrap">
      <a href={href} className="view-all-btn">
        {label} <ArrowRight />
      </a>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Section Tabs
───────────────────────────────────────────── */
function SectionTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="section-tabs" role="tablist" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`section-tab${activeTab === tab.id ? ' section-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   HERO SLIDER
───────────────────────────────────────────── */
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const total = heroSlides.length

  const prev = useCallback(() => setCurrentSlide((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrentSlide((c) => (c + 1) % total), [total])

  // Auto-advance every 4.5s
  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next, total])

  return (
    <section className="hero-slider" aria-label="Khuyến mãi nổi bật">
      <div
        className="hero-slider__track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <a key={slide.id} href={slide.href || '#redirect'} className="hero-slider__slide">
            <img src={slide.image} alt={slide.alt} className="hero-slider__img" />
          </a>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            className="hero-slider__arrow hero-slider__arrow--prev"
            onClick={prev}
            aria-label="Slide trước"
          >
            <ChevronLeft />
          </button>
          <button
            className="hero-slider__arrow hero-slider__arrow--next"
            onClick={next}
            aria-label="Slide tiếp theo"
          >
            <ChevronRight />
          </button>
          <div className="hero-slider__dots" role="tablist" aria-label="Slide indicators">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentSlide}
                aria-label={`Slide ${i + 1}`}
                className={`hero-slider__dot${i === currentSlide ? ' hero-slider__dot--active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────
   LOOKBOOK BANNERS
───────────────────────────────────────────── */
function LookbookBanners() {
  return (
    <section className="lookbooks" aria-label="Bộ sưu tập nổi bật">
      <div className="lookbooks__inner">
        {lookbookBanners.map((banner) => (
          <a key={banner.id} href={banner.href || '#redirect'} className="lookbooks__link">
            <img
              src={banner.image}
              alt={banner.alt}
              className="lookbooks__img"
            />
          </a>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   NEW ARRIVALS SECTION
───────────────────────────────────────────── */
function NewArrivals() {
  const [activeTab, setActiveTab] = useState(newArrivalsTabs[0].id)
  const products = newArrivalsProducts[activeTab] || []
  const activeTabData = newArrivalsTabs.find((t) => t.id === activeTab)

  return (
    <section className="product-section" aria-labelledby="new-arrivals-title">
      <div className="section-container">
        <div className="section-header">
          <h2 id="new-arrivals-title" className="section-title">NEW ARRIVALS</h2>
          <SectionTabs
            tabs={newArrivalsTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="product-grid" role="tabpanel">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))
          ) : (
            <p className="product-grid__empty">Sản phẩm sắp ra mắt.</p>
          )}
        </div>

        {products.length > 0 && (
          <ViewAllBtn href={activeTabData?.href || '#redirect'} />
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TENNIS PROMO BANNER
───────────────────────────────────────────── */
function TennisPromoBanner() {
  return (
    <section className="promo-banner" aria-label="Giảm tới 30% giày Tennis / Pickleball">
      <div className="section-container">
        <a href="/tennis-pickleball" className="promo-banner__link">
          <img
            src="/assets/banners/tennis-promo.png"
            alt="Giảm tới 30% — Giày, phụ kiện Tennis/Pickleball chính hãng tại Maxx Sport"
            className="promo-banner__img"
          />
        </a>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   BẬT MOOD MÙA MỚI — SALE SECTION
───────────────────────────────────────────── */
function BatMoodSection() {
  const [activeTab, setActiveTab] = useState(batMoodTabs[0].id)
  const products = batMoodProducts[activeTab] || []
  const activeTabData = batMoodTabs.find((t) => t.id === activeTab)

  return (
    <section className="batmood-section" aria-labelledby="batmood-title">
      <div className="section-container">
        <div className="batmood-section__inner">
          <div className="section-header section-header--left">
            <h2 id="batmood-title" className="section-title section-title--left">
              BẬT MOOD MÙA MỚI 🥿
            </h2>
            <SectionTabs
              tabs={batMoodTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="product-grid" role="tabpanel">
            {products.length > 0 ? (
              products.map((p) => (
                <SaleProductCard key={p.id} {...p} />
              ))
            ) : (
              <p className="product-grid__empty">Sản phẩm sắp ra mắt.</p>
            )}
          </div>

          {products.length > 0 && (
            <ViewAllBtn href={activeTabData?.href || '#redirect'} />
          )}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SPORT CATEGORIES
───────────────────────────────────────────── */
function SportCategories() {
  return (
    <section className="sport-cats" aria-label="Danh mục môn thể thao">
      <div className="section-container">
        <div className="sport-cats__grid">
          {sportCategories.map((cat) => (
            <a key={cat.id} href={cat.href || '#redirect'} className="sport-cat" aria-label={cat.name}>
              <img
                src={cat.image}
                alt={cat.name}
                className="sport-cat__img"
                loading="lazy"
              />
              <div className="sport-cat__overlay">
                <span className="sport-cat__label">
                  {cat.name} <span className="sport-cat__play" aria-hidden="true">▶</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TRENDING SECTION
───────────────────────────────────────────── */
function TrendingSection() {
  const [activeTab, setActiveTab] = useState(trendingTabs[0].id)
  const products = trendingProducts[activeTab] || []
  const activeTabData = trendingTabs.find((t) => t.id === activeTab)

  return (
    <section className="product-section" aria-labelledby="trending-title">
      <div className="section-container">
        <div className="section-header">
          <h2 id="trending-title" className="section-title">🔥 TRENDING 🔥</h2>
          <SectionTabs
            tabs={trendingTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="product-grid" role="tabpanel">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))
          ) : (
            <p className="product-grid__empty">Sản phẩm sắp ra mắt.</p>
          )}
        </div>

        {products.length > 0 && (
          <ViewAllBtn href={activeTabData?.href || '#redirect'} />
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   MUA SẮM TẠI CỬA HÀNG GẦN BẠN
───────────────────────────────────────────── */
function StoreNearby() {
  return (
    <section className="store-nearby" aria-labelledby="store-title">
      <div className="section-container">
        <h2 id="store-title" className="section-title store-nearby__title">
          MUA SẮM TẠI CỬA HÀNG GẦN BẠN
        </h2>
        <a href="/he-thong-cua-hang" className="store-nearby__link">
          <img
            src="/assets/banners/stores-nearby.svg"
            alt="Hệ thống cửa hàng Maxx Sport trên toàn quốc"
            className="store-nearby__img"
          />
        </a>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TIN TỨC & TIN KHUYẾN MẠI
───────────────────────────────────────────── */
function ArticleItem({ post }) {
  return (
    <a href={post.href || '#redirect'} className="article-item">
      <img
        src={post.image}
        alt={post.title}
        className="article-item__img"
        loading="lazy"
      />
      <div className="article-item__body">
        <h4 className="article-item__title">{post.title}</h4>
        <p className="article-item__excerpt">{post.excerpt}</p>
      </div>
    </a>
  )
}

function BlogNewsSection() {
  return (
    <section className="blog-news" aria-label="Tin tức và khuyến mãi">
      <div className="section-container">
        <div className="blog-news__grid">
          {/* TIN TỨC */}
          <div className="blog-col">
            <h3 className="blog-col__header">TIN TỨC</h3>
            <div className="blog-col__list">
              {blogPosts.map((post) => (
                <ArticleItem key={post.id} post={post} />
              ))}
            </div>
            <ViewAllBtn href="/tin-tuc-su-kien" />
          </div>

          {/* TIN KHUYẾN MẠI */}
          <div className="blog-col">
            <h3 className="blog-col__header">TIN KHUYẾN MẠI</h3>
            <div className="blog-col__list">
              {promoPosts.map((post) => (
                <ArticleItem key={post.id} post={post} />
              ))}
            </div>
            <ViewAllBtn href="/tin-khuyen-mai" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   HOME PAGE ROOT
───────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="home-page">
      <HeroSlider />
      <LookbookBanners />
      <NewArrivals />
      <TennisPromoBanner />
      <BatMoodSection />
      <SportCategories />
      <TrendingSection />
      <StoreNearby />
      <BlogNewsSection />
    </main>
  )
}
