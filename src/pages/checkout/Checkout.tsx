import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import { selectCartItems, selectCartSubtotal } from "../../redux/slice/cartSlice";
import { clearOrderError, resetOrder } from "../../redux/slice/orderSlice";
import { createOrder } from "../../redux/thunk/orderThunk";

interface FormValues {
  customerName: string;
  deliveryAddress: string;
  phone: string;
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartSubtotal);
  const { order, loading, error: apiError } = useAppSelector((state) => state.order);

  const [form, setForm] = useState<FormValues>({
    customerName: "",
    deliveryAddress: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  useEffect(() => {
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch]);

  function validate(): boolean {
    const nextErrors: Partial<FormValues> = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Enter your name";
    if (form.deliveryAddress.trim().length < 5)
      nextErrors.deliveryAddress = "Enter your delivery address";
    if (!/^[+0-9()\-\s]{7,20}$/.test(form.phone.trim()))
      nextErrors.phone = "Enter a valid phone number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (apiError) dispatch(clearOrderError());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || items.length === 0 || !validate()) return;

    dispatch(
      createOrder({
        customerName: form.customerName.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        phone: form.phone.trim(),
        items: items.map(({ item, quantity }) => ({
          menuItemId: item.id,
          quantity,
        })),
      }),
    );
  }

  if (order) {
    return (
      <section className="checkout-container" aria-live="polite">
        <h1>Order placed successfully!</h1>
        <p>Order #{order.id}</p>
        <p>Status: {order.status.replaceAll("_", " ")}</p>
        <p>Total: ₹{Number(order.total_amount).toFixed(2)}</p>
        <button type="button" onClick={() => navigate(`/orders/${order.id}`)}>
          Track order
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Back to menu
        </button>
      </section>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" replace />;

  return (
    <section className="checkout-container">
      <button type="button" onClick={() => navigate("/cart")} disabled={loading}>
        Back to Cart
      </button>

      <h1>Checkout</h1>

      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {items.map(({ item, quantity }) => (
          <div key={item.id} className="checkout-summary-row">
            <span>{item.name} × {quantity}</span>
            <span>₹{(item.price * quantity).toFixed(2)}</span>
          </div>
        ))}
        <p className="checkout-total">Total: ₹{total.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="checkout-field">
          <label htmlFor="customerName">Full name</label>
          <input
            id="customerName"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            aria-invalid={Boolean(errors.customerName)}
          />
          {errors.customerName && <p className="field-error">{errors.customerName}</p>}
        </div>

        <div className="checkout-field">
          <label htmlFor="deliveryAddress">Delivery address</label>
          <textarea
            id="deliveryAddress"
            value={form.deliveryAddress}
            onChange={(e) => updateField("deliveryAddress", e.target.value)}
            aria-invalid={Boolean(errors.deliveryAddress)}
          />
          {errors.deliveryAddress && <p className="field-error">{errors.deliveryAddress}</p>}
        </div>

        <div className="checkout-field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        {apiError && (
          <p role="alert" className="field-error">{apiError}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </section>
  );
}