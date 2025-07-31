"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem, MenuCategory } from "@/types/menu";
import { getMenuItems, getCategories } from "@/lib/menuService";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadHomeData();
    }
  }, [user]);

  const loadHomeData = async () => {
    try {
      setLoadingData(true);
      const [items, cats] = await Promise.all([
        getMenuItems(),
        getCategories()
      ]);
      
      // Get featured items (first 6 available items)
      const availableItems = items.filter(item => item.available);
      setFeaturedItems(availableItems.slice(0, 6));
      setCategories(cats);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const renderImage = (image: string) => {
    if (image && image.startsWith('http')) {
  return (
        <img
          src={image}
          alt="Menu item"
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    } else {
      return (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
          {image || '🍽️'}
        </div>
      );
    }
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
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-orange-700 mb-6">
            Welcome to Our Restaurant
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover the finest flavors and authentic cuisine prepared with love and fresh ingredients
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-lg"
            >
              Explore Our Menu
            </Link>
            <Link
              href="/about"
              className="bg-white text-orange-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-50 transition shadow-lg border border-orange-200"
          >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-orange-700 text-center mb-12">
            Our Menu Categories
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.name}`}
                className="bg-white/90 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-orange-200"
              >
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="text-xl font-bold text-orange-700 mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-orange-700 text-center mb-12">
            Featured Dishes
          </h2>
          {loadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white/90 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-orange-200">
                  {renderImage(item.image)}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-orange-700 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-black">ETB {item.price}</span>
                      <Link
                        href="/menu"
                        className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
                      >
                        Order Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured items available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Special Offers</h2>
            <p className="text-xl mb-8 opacity-90">
              Get 20% off on your first order! Use code: WELCOME20
            </p>
            <Link
              href="/menu"
              className="bg-white text-orange-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-50 transition shadow-lg"
            >
              Order Now & Save
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-orange-700 text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Amazing food and excellent service! The flavors are incredible and the portions are perfect."
              </p>
              <div className="font-semibold text-orange-700">- Sarah M.</div>
            </div>
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Best restaurant in town! Fresh ingredients and authentic taste. Highly recommended!"
              </p>
              <div className="font-semibold text-orange-700">- John D.</div>
            </div>
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Great atmosphere and delicious food. The staff is friendly and the prices are reasonable."
              </p>
              <div className="font-semibold text-orange-700">- Maria L.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-orange-700 mb-8">
            Visit Us Today
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Location</h3>
              <p className="text-gray-600">123 Restaurant Street<br />Addis Ababa, Ethiopia</p>
            </div>
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-3xl mb-4">🕒</div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Sun: 8:00 AM - 10:00 PM</p>
            </div>
            <div className="bg-white/90 rounded-2xl p-6 border border-orange-200">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Contact</h3>
              <p className="text-gray-600">+251 911 123 456<br />info@restaurant.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
