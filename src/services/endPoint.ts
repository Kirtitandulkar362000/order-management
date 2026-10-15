const API_ENDPOINTS = {
  GET_MENU: "/menu",
  GET_MENU_BY_ID: (id: string) => `/menu/${id}`,
  CREATE_ORDER: "/create-orders",
  GET_ORDER_BY_ID: (id: number) => `/orders?id=${id}`,
  UPDATE_ORDER_STATUS: `/update-orders`,
};
export default API_ENDPOINTS;
