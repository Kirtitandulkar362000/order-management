import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
} from "../thunk/orderThunk";
import type { CreatedOrder, OrderDetails } from "../../types/orderTypes";

interface OrderState {
  // checkout
  order: CreatedOrder | null;
  loading: boolean;
  error: string | null;
  // tracking (separate flags so polling doesn't affect checkout)
  orderById: OrderDetails | null;
  trackingLoading: boolean;
  trackingError: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
  orderById: null,
  trackingLoading: false,
  trackingError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: () => initialState,
    clearOrderError: (state) => {
      state.error = null;
    },
    clearTracking: (state) => {
      state.orderById = null;
      state.trackingLoading = false;
      state.trackingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to create order";
      })
      .addCase(getOrderById.pending, (state) => {
        if (!state.orderById) state.trackingLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.trackingError = null;
        state.orderById = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.trackingLoading = false;
        state.trackingError =
          action.payload?.message ??
          action.error.message ??
          "Failed to fetch order";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to update order status";
      });
  },
});

export const { resetOrder, clearOrderError, clearTracking } =
  orderSlice.actions;
export default orderSlice.reducer;