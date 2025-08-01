import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, CreateOrderData, OrderStatus } from "@/types/order";

// Create a new order
export const createOrder = async (orderData: CreateOrderData): Promise<string> => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: 'pending' as OrderStatus,
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return orderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

// Get order by ID
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    
    if (orderDoc.exists()) {
      const data = orderDoc.data();
      return {
        id: orderDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate(),
        actualDeliveryTime: data.actualDeliveryTime?.toDate(),
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw new Error("Failed to get order");
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate(),
        actualDeliveryTime: data.actualDeliveryTime?.toDate(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw new Error("Failed to get user orders");
  }
};

// Get all orders (for admin)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate(),
        actualDeliveryTime: data.actualDeliveryTime?.toDate(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw new Error("Failed to get all orders");
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

// Update payment status
export const updatePaymentStatus = async (orderId: string, paymentStatus: 'pending' | 'completed' | 'failed'): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status");
  }
};

// Get orders by status (for admin)
export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate(),
        actualDeliveryTime: data.actualDeliveryTime?.toDate(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting orders by status:", error);
    throw new Error("Failed to get orders by status");
  }
}; 