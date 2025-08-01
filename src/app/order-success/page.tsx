"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createOrder } from "@/lib/orderService";
import { CreateOrderData } from "@/types/order";

export default function OrderSuccessPage() {
  const { user, loading } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && cart.items.length > 0) {
      createOrderInFirestore();
    } else {
      setIsCreatingOrder(false);
    }
  }, [user, cart]);

  const createOrderInFirestore = async () => {
    try {
      setIsCreatingOrder(true);
      
      // Get delivery address from localStorage or use default
      const savedAddress = localStorage.getItem('delivery-address');
      let deliveryAddress;
      
      if (savedAddress) {
        try {
          deliveryAddress = JSON.parse(savedAddress);
        } catch (e) {
          console.error("Error parsing saved address:", e);
          deliveryAddress = {
            street: 'Default Address',
            city: 'Addis Ababa',
            phone: user?.phoneNumber || 'N/A',
            instructions: ''
          };
        }
      } else {
        deliveryAddress = {
          street: 'Default Address',
          city: 'Addis Ababa',
          phone: user?.phoneNumber || 'N/A',
          instructions: ''
        };
      }

      console.log("Creating order with data:", {
        userId: user!.uid,
        userEmail: user!.email!,
        userName: user!.displayName || user!.email!.split('@')[0],
        items: cart.items,
        total: cart.total,
        deliveryFee: 50,
        grandTotal: cart.total + 50,
        deliveryAddress
      });

      const orderData: CreateOrderData = {
        userId: user!.uid,
        userEmail: user!.email!,
        userName: user!.displayName || user!.email!.split('@')[0],
        items: cart.items,
        total: cart.total,
        deliveryFee: 50,
        grandTotal: cart.total + 50,
        paymentMethod: 'stripe', // or 'paypal' based on what was used
        deliveryAddress
      };

      const newOrderId = await createOrder(orderData);
      console.log("Order created successfully with ID:", newOrderId);
      setOrderId(newOrderId);
      
      // Clear cart after successful order creation
      clearCart();
      
      // Clear saved delivery address
      localStorage.removeItem('delivery-address');
      
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (loading || isCreatingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-orange-700">
            {isCreatingOrder ? "Creating your order..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/90 rounded-2xl shadow-xl p-12 border border-orange-200">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-orange-700 mb-4">Order Successful!</h1>
            <p className="text-xl text-gray-700 mb-6">Thank you for your order!</p>
            
            {orderId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 font-medium">Order ID: {orderId}</p>
                <p className="text-green-600 text-sm">We'll send you updates about your order</p>
              </div>
            )}
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">What's Next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👨‍🍳</span>
                  <span className="text-gray-700">Our chefs are preparing your order</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚚</span>
                  <span className="text-gray-700">We'll deliver it to your address</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-gray-700">You'll receive updates via email</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/orders"
                className="block w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
              >
                View My Orders
              </Link>
              <Link
                href="/"
                className="block w-full bg-white text-orange-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-50 transition border border-orange-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 