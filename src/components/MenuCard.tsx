import type { MenuItem } from "../types/menuTypes";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <article className="menu-card">
      <img src={item.image_url} alt={item.name} className="menu-card-image" />

      <div className="menu-card-content">
        <span className="menu-category">{item.category}</span>

        <h2>{item.name}</h2>
        <p>{item.description}</p>

        <div className="menu-card-footer">
          <strong>₹{item.price}</strong>

          <button
            type="button"
            disabled={item.is_available === 0}
            onClick={() => onAddToCart(item)}
          >
            {item.is_available === 1 ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
