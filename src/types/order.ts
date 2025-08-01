export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: 'stripe' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryAddress: {
    street: string;
    city: string;
    phone: string;
    instructions?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
}

export interface CreateOrderData {
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'stripe' | 'paypal';
  deliveryAddress: {
    street: string;
    city: string;
    phone: string;
    instructions?: string;
  };
} 