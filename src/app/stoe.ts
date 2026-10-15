import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../redux/slice/menuSlice";
import cartReducer from "../redux/slice/cartSlice";
import orderReducer from "../redux/slice/orderSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;