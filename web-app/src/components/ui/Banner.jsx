export default function Banner({ title, subtitle, image, ctaText, onCtaClick }) {
  return (
    <section className="banner">
      {image && <img src={image} alt={title} className="banner-image" />}
      <div className="banner-content">
        <h1 className="banner-title">{title}</h1>
        {subtitle && <p className="banner-subtitle">{subtitle}</p>}
        {ctaText && (
          <button className="banner-cta" onClick={onCtaClick}>
            {ctaText}
          </button>
        )}
      </div>
    </section>
  );
}
