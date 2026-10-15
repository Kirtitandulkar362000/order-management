export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: number; // 1 for available, 0 for unavailable
}
export interface CartItem {
  item: MenuItem;
  quantity: number;
}