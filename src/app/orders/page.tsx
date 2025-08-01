"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserOrders } from "@/lib/orderService";
import { Order } from "@/types/order";
import Link from "next/link";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const userOrders = await getUserOrders(user!.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '✅';
      case 'delivered':
        return '🚚';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-orange-700">My Orders</h1>
            <Link
              href="/menu"
              className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
            >
              Order More Food
            </Link>
          </div>

          {loadingOrders ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white/90 rounded-2xl shadow-xl p-12 border border-orange-200 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-orange-700 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start ordering delicious food to see your order history here.</p>
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/90 rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-orange-700">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          <span className="mr-2">{getStatusEmoji(order.status)}</span>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <p className="text-lg font-bold text-orange-700 mt-1">ETB {order.grandTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                              {item.image && item.image.startsWith('http') ? '🍽️' : item.image || '🍽️'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold text-black">ETB {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>ETB {order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span>ETB {order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-orange-700">
                        <span>Total:</span>
                        <span>ETB {order.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Delivery Address:</h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </p>
                      <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                      {order.deliveryAddress.instructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          Instructions: {order.deliveryAddress.instructions}
                        </p>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                      <span>Payment: {order.paymentMethod.toUpperCase()}</span>
                      <span>Status: {order.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 