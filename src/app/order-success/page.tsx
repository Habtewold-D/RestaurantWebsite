"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { user, loading } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
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
            <p className="text-xl text-gray-700 mb-8">Thank you for your order!</p>
            
            <div className="space-y-4">
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/menu"
                className="block w-full bg-white text-orange-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-50 transition border border-orange-200"
              >
                Order More Food
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 