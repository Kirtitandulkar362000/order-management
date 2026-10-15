import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CartItem, MenuItem } from "../../types/menuTypes";
import type { RootState } from "../../app/stoe";
import { createOrder } from "../thunk/orderThunk";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<MenuItem>) => {
      const item = action.payload;
      if (item.is_available === 0) return;

      const existing = state.items.find((c) => c.item.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ item, quantity: 1 });
      }
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const existing = state.items.find((c) => c.item.id === action.payload);
      if (existing) existing.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const existing = state.items.find((c) => c.item.id === action.payload);
      if (!existing) return;
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        state.items = state.items.filter((c) => c.item.id !== action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((c) => c.item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, c) => total + c.quantity, 0),
);

export const selectCartSubtotal = createSelector(
  selectCartItems,
  (items: CartItem[]) =>
    items.reduce((total, c) => total + c.item.price * c.quantity, 0),
);

export default cartSlice.reducer;
