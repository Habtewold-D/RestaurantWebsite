import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus } from "@/types/order";
import { MenuItem } from "@/types/menu";

// Get sales analytics for a date range
export const getSalesAnalytics = async (startDate: Date, endDate: Date) => {
  try {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", startTimestamp),
      where("createdAt", "<=", endTimestamp),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by date
    const dailySales = orders.reduce((acc, order) => {
      const date = order.createdAt.toDateString();
      if (!acc[date]) {
        acc[date] = { revenue: 0, orders: 0 };
      }
      acc[date].revenue += order.grandTotal;
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { revenue: number; orders: number }>);
    
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      dailySales,
      orders
    };
  } catch (error) {
    console.error("Error getting sales analytics:", error);
    throw error;
  }
};

// Get popular items (most ordered)
export const getPopularItems = async (limit: number = 10) => {
  try {
    // Get all orders
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders: Order[] = [];
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    // Count item occurrences
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.menuItemId]) {
          itemCounts[item.menuItemId] = {
            name: item.name,
            count: 0,
            revenue: 0
          };
        }
        itemCounts[item.menuItemId].count += item.quantity;
        itemCounts[item.menuItemId].revenue += item.price * item.quantity;
      });
    });
    
    // Convert to array and sort by count
    const popularItems = Object.entries(itemCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return popularItems;
  } catch (error) {
    console.error("Error getting popular items:", error);
    throw error;
  }
};

// Get customer analytics
export const getCustomerAnalytics = async () => {
  try {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders: Order[] = [];
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    // Group by customer
    const customerStats: Record<string, {
      email: string;
      name: string;
      orders: number;
      totalSpent: number;
      averageOrder: number;
      lastOrder: Date;
    }> = {};
    
    orders.forEach(order => {
      if (!customerStats[order.userId]) {
        customerStats[order.userId] = {
          email: order.userEmail,
          name: order.userName,
          orders: 0,
          totalSpent: 0,
          averageOrder: 0,
          lastOrder: order.createdAt
        };
      }
      
      customerStats[order.userId].orders += 1;
      customerStats[order.userId].totalSpent += order.grandTotal;
      customerStats[order.userId].lastOrder = order.createdAt;
    });
    
    // Calculate averages
    Object.values(customerStats).forEach(customer => {
      customer.averageOrder = customer.totalSpent / customer.orders;
    });
    
    // Convert to array and sort by total spent
    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.totalSpent - a.totalSpent);
    
    return {
      totalCustomers: Object.keys(customerStats).length,
      topCustomers,
      averageCustomerOrder: topCustomers.length > 0 
        ? topCustomers.reduce((sum, c) => sum + c.averageOrder, 0) / topCustomers.length 
        : 0
    };
  } catch (error) {
    console.error("Error getting customer analytics:", error);
    throw error;
  }
};

// Get order status distribution
export const getOrderStatusDistribution = async () => {
  try {
    const ordersQuery = query(collection(db, "orders"));
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders: Order[] = [];
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    const statusCounts: Record<OrderStatus, number> = {
      pending: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0
    };
    
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    return statusCounts;
  } catch (error) {
    console.error("Error getting order status distribution:", error);
    throw error;
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (limitCount: number = 5) => {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting recent orders:", error);
    throw error;
  }
}; 