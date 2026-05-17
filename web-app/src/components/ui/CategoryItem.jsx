export default function CategoryItem({ id, name, icon, image }) {
  return (
    <div className="category-item">
      <div className="category-image">
        {image && <img src={image} alt={name} />}
        {icon && <span className="category-icon">{icon}</span>}
      </div>
      <h4 className="category-name">{name}</h4>
    </div>
  );
}
