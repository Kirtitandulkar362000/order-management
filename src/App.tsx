import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const Menu = lazy(() => import("./pages/menu/Menu.tsx"));
const Checkout = lazy(() => import("./pages/checkout/Checkout.tsx"));
const Cart = lazy(() => import("./components/Cart.tsx"));
const OrderTrackingPage = lazy(() => import("./pages/orders/OrderTrackingPage.tsx"));

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="">Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;