import { api } from "../../services/baseApi";
import API_ENDPOINTS from "../../services/endPoint";
import { createApiThunk } from "../apiThunk";

export const getMenu = createApiThunk("menu/getMenu", async () => {
  const response = await api.get(API_ENDPOINTS.GET_MENU);
  return response.data?.data;
});

export const getMenuById = createApiThunk("menu/getMenuById", async (id: string) => {
  const response = await api.get(API_ENDPOINTS.GET_MENU_BY_ID(id));
  return response.data;
});