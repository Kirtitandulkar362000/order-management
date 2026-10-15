import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../../redux/thunk/menuThunk";
import { addItem, selectCartCount } from "../../redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import MenuCard from "../../components/MenuCard";

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { menu, loading, error } = useAppSelector((state) => state.menu);
  const cartCount = useAppSelector(selectCartCount);

  useEffect(() => {
    dispatch(getMenu(undefined));
  }, [dispatch]);

  if (loading) return <p role="status">Loading menu...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main className="menu-page">
      <header className="menu-header">
        <div>
          <p className="eyebrow">FRESHLY PREPARED</p>
          <h1>Discover Our Menu</h1>
          <p>Delicious food, delivered to your door.</p>
        </div>

        <button
          type="button"
          className="cart-indicator"
          aria-label={`Open cart, ${cartCount} items`}
          onClick={() => navigate("/cart")}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <section className="menu-grid" aria-label="Food menu">
        {menu.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={() => dispatch(addItem(item))}
          />
        ))}
      </section>
    </main>
  );
}