import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
} from "../redux/slice/cartSlice";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const count = items.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <main className="cart-page">
      <button type="button" className="cartBack" onClick={() => navigate("/")}>
        ← Back to menu
      </button>

      <h1>Your Cart ({count})</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price.toFixed(2)} each</p>
                <strong>₹{(item.price * quantity).toFixed(2)}</strong>
              </div>

              <div className="quantity-controls">
                <button
                  aria-label={`Decrease ${item.name}`}
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  aria-label={`Increase ${item.name}`}
                  onClick={() => dispatch(increaseQuantity(item.id))}
                >
                  +
                </button>
                <button onClick={() => dispatch(removeItem(item.id))}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <strong>Subtotal</strong>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </main>
  );
}
