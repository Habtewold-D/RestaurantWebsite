"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MenuManagement from "@/components/MenuManagement";
import OrderManagement from "@/components/OrderManagement";
import ReviewManagement from "@/components/ReviewManagement";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'orders' | 'reviews' | 'analytics'>('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && role !== 'admin') {
      router.push("/");
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-700">Loading...</div>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
          Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 rounded-lg p-1 shadow-lg border border-orange-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'analytics'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-700'
              }`}
            >
              📈 Analytics
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'menu'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-700'
              }`}
            >
              🍽️ Menu Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-700'
              }`}
            >
              📋 Order Management
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'reviews'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-700'
              }`}
            >
              ⭐ Review Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
          {activeTab === 'dashboard' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">Welcome, Admin!</h2>
              <p className="text-gray-600 mb-8">
                Manage your restaurant's menu, orders, reviews, and view analytics from this dashboard.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-700 mb-2">Analytics</h3>
                  <p className="text-gray-600 mb-4">View sales reports and business insights.</p>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    View Analytics
                  </button>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-700 mb-2">Menu Management</h3>
                  <p className="text-gray-600 mb-4">Add, edit, and manage menu items and categories.</p>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Manage Menu
                  </button>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-700 mb-2">Order Management</h3>
                  <p className="text-gray-600 mb-4">View and update order statuses.</p>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Manage Orders
                  </button>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-700 mb-2">Review Management</h3>
                  <p className="text-gray-600 mb-4">Moderate customer reviews and ratings.</p>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Manage Reviews
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'reviews' && <ReviewManagement />}
        </div>
      </div>
    </div>
  );
} 