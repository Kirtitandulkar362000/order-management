
export interface CreateOrderRequest {
  customerName: string;
  deliveryAddress: string;
  phone: string;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
}

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface CreatedOrder {
  id: number;
  customerName: string;
  deliveryAddress: string;
  phone: string;
  total_amount: number;
  status: OrderStatus;
}

export interface OrderDetailsItem {
  menuItemId: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDetails {
  id: number;
  customerName: string;
  deliveryAddress: string;
  phone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderDetailsItem[];
}