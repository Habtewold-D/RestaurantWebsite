"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-xl p-12 border border-orange-200 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">Your cart is empty</h2>
            <button
              onClick={() => router.push("/menu")}
              className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-700">Cart Items ({cart.itemCount})</h2>
              <button
                onClick={() => clearCart()}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-700">{item.name}</h3>
                    <p className="text-black font-semibold">ETB {item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-black">ETB {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-black">Total: ETB {cart.total.toFixed(2)}</span>
                <button className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 