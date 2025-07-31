export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
} 