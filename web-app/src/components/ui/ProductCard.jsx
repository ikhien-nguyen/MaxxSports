import { Link } from 'react-router-dom';

export default function ProductCard({ id, image, name, price, category }) {
  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          <img src={image} alt={name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-category">{category}</p>
          <p className="product-price">${price}</p>
        </div>
      </div>
    </Link>
  );
}
