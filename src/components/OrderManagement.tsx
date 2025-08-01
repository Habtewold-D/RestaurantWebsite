"use client";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/orderService";
import { Order, OrderStatus } from "@/types/order";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Reload orders
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '✅';
      case 'delivered': return '🚚';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-700">Order Management</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">Order #{order.id.slice(-8)}</h3>
                    <p className="text-sm text-gray-600">{order.userName} - {order.userEmail}</p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{getStatusEmoji(order.status)}</span>
                      {order.status}
                    </div>
                    <p className="font-bold text-orange-700 mt-1">ETB {order.grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Delivery:</h4>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.street}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.city}</p>
                    <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                    {order.deliveryAddress.instructions && (
                      <p className="text-sm text-gray-600">Note: {order.deliveryAddress.instructions}</p>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Update Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 