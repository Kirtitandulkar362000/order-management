import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import type { OrderDetailsItem, OrderStatus } from "../../types/orderTypes";
import { getOrderById } from "../../redux/thunk/orderThunk";
import { clearTracking } from "../../redux/slice/orderSlice";

const POLL_INTERVAL_MS = 5000;

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "ORDER_RECEIVED", label: "Order Received" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
];

export default function OrderTrackingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();

  const orderId = Number(orderIdParam);
  const isValidId = Number.isInteger(orderId) && orderId > 0;

  const { orderById, trackingError } = useAppSelector((state) => state.order);

  const order = isValidId && orderById?.id === orderId ? orderById : null;

  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const result = await dispatch(getOrderById(orderId)).unwrap();
        if (cancelled) return;

        if (result.status !== "DELIVERED") {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;

        const status = (err as { status?: number })?.status;
        if (status === 404 || status === 400) return;

        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      dispatch(clearTracking());
    };
  }, [dispatch, orderId, isValidId]);

  if (!isValidId) {
    return (
      <main className="tracking-container">
        <p role="alert">Invalid order link.</p>
        <button type="button" onClick={() => navigate("/")} className="back-button">
          Back to Menu
        </button>
      </main>
    );
  }

  if (!order && trackingError) {
    return (
      <main className="tracking-container">
        <p role="alert">{trackingError}</p>
        <button type="button" onClick={() => navigate("/")} className="back-button">
          Back to Menu
        </button>
      </main>
    );
  }

  if (!order) {
    return <p role="status">Loading order tracking...</p>;
  }

  const currentIndex = statuses.findIndex((s) => s.value === order.status);

  return (
    <main className="tracking-container">
      <button type="button" onClick={() => navigate("/")} className="back-button">
        Back to Menu
      </button>

      <h1>Track Your Order</h1>
      <p>Order #{order.id}</p>
      <p>Customer: {order.customerName}</p>

      <section aria-label="Order progress" className="tracking-steps">
        {statuses.map((status, index) => {
          const completed = index <= currentIndex;

          return (
            <div
              key={status.value}
              className={`tracking-step ${completed ? "completed" : ""}`}
            >
              <span className="tracking-dot" aria-hidden="true">
                {completed ? "✓" : index + 1}
              </span>
              <span>{status.label}</span>
            </div>
          );
        })}
      </section>

      <section>
        <h2>Items</h2>
        {order.items.map((item: OrderDetailsItem) => (
          <p key={item.menuItemId}>
            {item.itemName} × {item.quantity} — ₹{item.lineTotal}
          </p>
        ))}
        <strong>Total: ₹{order.totalAmount}</strong>
      </section>

      <p>
        Current status:{" "}
        <strong>{statuses[currentIndex]?.label ?? order.status}</strong>
      </p>

      {trackingError && (
        <p role="status">{trackingError} Retrying automatically.</p>
      )}
    </main>
  );
}