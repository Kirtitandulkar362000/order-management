import { createSlice } from "@reduxjs/toolkit";
import { getMenu, getMenuById } from "../thunk/menuThunk";
import type { MenuItem } from "../../types/menuTypes";

interface MenuState {
  menu: MenuItem[];
  menuById: MenuItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menu: [],
  menuById: null,
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload ?? [];
      })
      .addCase(getMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to load menu";
      })
      .addCase(getMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.menuById = action.payload;
      })
      .addCase(getMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to load item";
      });
  },
});

export default menuSlice.reducer;