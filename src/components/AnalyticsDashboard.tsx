"use client";
import { useState, useEffect } from "react";
import { 
  getSalesAnalytics, 
  getPopularItems, 
  getCustomerAnalytics, 
  getOrderStatusDistribution,
  getRecentOrders 
} from "@/lib/analyticsService";
import { Order } from "@/types/order";

interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: Record<string, { revenue: number; orders: number }>;
  orders: Order[];
}

interface PopularItem {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

interface CustomerAnalytics {
  totalCustomers: number;
  topCustomers: Array<{
    email: string;
    name: string;
    orders: number;
    totalSpent: number;
    averageOrder: number;
    lastOrder: Date;
  }>;
  averageCustomerOrder: number;
}

export default function AnalyticsDashboard() {
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({});
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Load all analytics data
      const [
        sales,
        popular,
        customers,
        statusDist,
        recent
      ] = await Promise.all([
        getSalesAnalytics(startDate, endDate),
        getPopularItems(10),
        getCustomerAnalytics(),
        getOrderStatusDistribution(),
        getRecentOrders(5)
      ]);

      setSalesData(sales);
      setPopularItems(popular);
      setCustomerData(customers);
      setStatusDistribution(statusDist);
      setRecentOrders(recent);
      
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-700">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              dateRange === '7d'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              dateRange === '30d'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              dateRange === '90d'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Sales Overview Cards */}
      {salesData && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 rounded-lg p-6 border border-orange-200">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-orange-700">{formatCurrency(salesData.totalRevenue)}</p>
            <p className="text-sm text-gray-500 mt-1">Last {dateRange}</p>
          </div>
          <div className="bg-white/90 rounded-lg p-6 border border-orange-200">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-700">{salesData.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Last {dateRange}</p>
          </div>
          <div className="bg-white/90 rounded-lg p-6 border border-orange-200">
            <h3 className="text-sm font-medium text-gray-600">Average Order Value</h3>
            <p className="text-3xl font-bold text-orange-700">{formatCurrency(salesData.averageOrderValue)}</p>
            <p className="text-sm text-gray-500 mt-1">Per order</p>
          </div>
          <div className="bg-white/90 rounded-lg p-6 border border-orange-200">
            <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
            <p className="text-3xl font-bold text-orange-700">{customerData?.totalCustomers || 0}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-white/90 rounded-lg border border-orange-200">
          <div className="p-6 border-b border-orange-200">
            <h3 className="text-xl font-bold text-orange-700">Popular Items</h3>
          </div>
          <div className="p-6">
            {popularItems.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {popularItems.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-orange-700">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white/90 rounded-lg border border-orange-200">
          <div className="p-6 border-b border-orange-200">
            <h3 className="text-xl font-bold text-orange-700">Order Status</h3>
          </div>
          <div className="p-6">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <span className="font-bold text-black">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      {customerData && (
        <div className="bg-white/90 rounded-lg border border-orange-200">
          <div className="p-6 border-b border-orange-200">
            <h3 className="text-xl font-bold text-orange-700">Top Customers</h3>
          </div>
          <div className="p-6">
            {customerData.topCustomers.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No customers yet</p>
            ) : (
              <div className="space-y-4">
                {customerData.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.email} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-orange-700">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-gray-500">{customer.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white/90 rounded-lg border border-orange-200">
        <div className="p-6 border-b border-orange-200">
          <h3 className="text-xl font-bold text-orange-700">Recent Orders</h3>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{order.userName}</p>
                    <p className="text-sm text-gray-500">{order.userEmail}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">{formatCurrency(order.grandTotal)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
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