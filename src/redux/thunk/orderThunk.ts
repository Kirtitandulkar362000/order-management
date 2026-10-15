import { api } from "../../services/baseApi";
import API_ENDPOINTS from "../../services/endPoint";
import { createApiThunk } from "../apiThunk";

export const createOrder = createApiThunk(
  "order/createOrder",
  async (orderData: any) => {
    const response = await api.post(API_ENDPOINTS.CREATE_ORDER, orderData);
    console.log(response.data, "data");
    return response.data?.data;
  },
);

export const getOrderById = createApiThunk(
  "order/getOrderById",
  async (id: number) => {
    const response = await api.get(API_ENDPOINTS.GET_ORDER_BY_ID(id));
    return response.data?.data;
  },
);

export const updateOrderStatus = createApiThunk(
  "order/updateOrderStatus",
  async (orderData: any) => {
    const response = await api.put(
      API_ENDPOINTS.UPDATE_ORDER_STATUS,
      orderData,
    );
    return response.data?.data;
  },
);
