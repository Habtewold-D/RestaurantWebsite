"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "admin") {
        router.push("/"); // Redirect non-admin users to home
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-700">Loading...</div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
          Admin Dashboard
        </h1>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">150</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">$2,450</div>
              <div className="text-gray-600">Today's Revenue</div>
            </div>
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">25</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">4.8</div>
              <div className="text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Menu Management</h2>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  Add New Menu Item
                </button>
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  Edit Menu Items
                </button>
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  Manage Categories
                </button>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Order Management</h2>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  View All Orders
                </button>
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  Process Orders
                </button>
                <button className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                  Order Analytics
                </button>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-6">User Management</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button className="bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                View All Users
              </button>
              <button className="bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                Manage Roles
              </button>
              <button className="bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                User Analytics
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-3 rounded-lg font-medium hover:from-green-500 hover:to-blue-500 transition shadow-md">
                📊 Reports
              </button>
              <button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition shadow-md">
                ⚙️ Settings
              </button>
              <button className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white py-3 rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition shadow-md">
                📧 Notifications
              </button>
              <button className="bg-gradient-to-r from-red-400 to-orange-400 text-white py-3 rounded-lg font-medium hover:from-red-500 hover:to-orange-500 transition shadow-md">
                🔒 Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 