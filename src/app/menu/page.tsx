"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const menuItems = [
  {
    category: "Starters",
    items: [
      { name: "Bruschetta", description: "Toasted bread with tomatoes, garlic, and basil", price: 8.99, image: "🥖" },
      { name: "Calamari", description: "Crispy fried squid with marinara sauce", price: 12.99, image: "🦑" },
      { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil", price: 10.99, image: "🥗" },
    ]
  },
  {
    category: "Main Courses",
    items: [
      { name: "Grilled Salmon", description: "Atlantic salmon with seasonal vegetables", price: 24.99, image: "🐟" },
      { name: "Beef Tenderloin", description: "8oz tenderloin with garlic mashed potatoes", price: 28.99, image: "🥩" },
      { name: "Chicken Marsala", description: "Pan-seared chicken in marsala wine sauce", price: 22.99, image: "🍗" },
      { name: "Vegetable Pasta", description: "Fresh vegetables with alfredo sauce", price: 18.99, image: "🍝" },
    ]
  },
  {
    category: "Desserts",
    items: [
      { name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone", price: 9.99, image: "🍰" },
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: 8.99, image: "🍫" },
      { name: "Crème Brûlée", description: "Vanilla custard with caramelized sugar", price: 7.99, image: "🍮" },
    ]
  },
  {
    category: "Beverages",
    items: [
      { name: "Fresh Lemonade", description: "Homemade lemonade with mint", price: 4.99, image: "🍋" },
      { name: "Iced Tea", description: "House blend iced tea", price: 3.99, image: "🥤" },
      { name: "Espresso", description: "Single shot of premium espresso", price: 3.50, image: "☕" },
    ]
  }
];

export default function MenuPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
          Our Menu
        </h1>
        <p className="text-center text-gray-700 mb-12 text-lg">
          Discover our delicious dishes prepared with fresh, local ingredients
        </p>

        <div className="space-y-12">
          {menuItems.map((category) => (
            <div key={category.category} className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
              <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div key={item.name} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-4 text-center">{item.image}</div>
                    <h3 className="text-xl font-bold text-orange-700 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                      <button className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 