"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem, MenuCategory } from "@/types/menu";
import { getMenuItems, getCategories } from "@/lib/menuService";

export default function MenuPage() {
  const { user, loading } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadMenuData();
    }
  }, [user]);

  const loadMenuData = async () => {
    try {
      setLoadingMenu(true);
      const [items, cats] = await Promise.all([
        getMenuItems(),
        getCategories()
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error("Error loading menu data:", error);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    // You could add a toast notification here
    console.log(`Added ${item.name} to cart`);
  };

  const renderImage = (image: string) => {
    if (image && image.startsWith('http')) {
      return (
        <div className="mb-4 text-center">
          <img
            src={image}
            alt="Menu item"
            className="w-full h-64 object-cover rounded-lg mx-auto shadow-md"
            onError={(e) => {
              console.log("Menu image failed to load:", image);
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <div className="w-full h-64 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-6xl" style={{ display: 'none' }}>
            🍽️
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-4xl mb-4 text-center">
          {image || '🍽️'}
        </div>
      );
    }
  };

  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.emoji || "🍽️";
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

  // Filter menu items by selected category
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Group items by category
  const itemsByCategory = categories.reduce((acc, category) => {
    const categoryItems = menuItems.filter(item => item.category === category.name);
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
          Our Menu
        </h1>
        <p className="text-center text-gray-700 mb-12 text-lg">
          Discover our delicious dishes prepared with fresh, local ingredients
        </p>

        {loadingMenu ? (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-orange-700 mb-4">Loading Menu...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-orange-700 mb-4">No Menu Items Available</div>
            <p className="text-gray-600">Menu items will appear here once they are added by an administrator.</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-orange-700 mb-4 text-center">Filter by Category</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-md"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedCategory === category.name
                          ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-md"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      }`}
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items Display */}
            {selectedCategory === "all" ? (
              // Show items grouped by category
              <div className="space-y-12">
                {categories.map((category) => {
                  const categoryItems = itemsByCategory[category.name];
                  if (!categoryItems || categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
                      <div className="flex items-center justify-center mb-6">
                        <span className="text-4xl mr-3">{category.emoji}</span>
                        <h2 className="text-3xl font-bold text-orange-700">
                          {category.name}
                        </h2>
                      </div>
                      {category.description && (
                        <p className="text-center text-gray-600 mb-8">{category.description}</p>
                      )}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                            {renderImage(item.image)}
                            <h3 className="text-xl font-bold text-orange-700 mb-2">{item.name}</h3>
                            <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-black">ETB {item.price}</span>
                              <button 
                                onClick={() => handleAddToCart(item)}
                                className={`px-4 py-2 rounded-lg font-medium transition shadow-md ${
                                  item.available
                                    ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:from-orange-500 hover:to-rose-500"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                                disabled={!item.available}
                              >
                                {item.available ? "Add to Cart" : "Unavailable"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Show filtered items
              <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-4xl mr-3">
                    {getCategoryEmoji(selectedCategory)}
                  </span>
                  <h2 className="text-3xl font-bold text-orange-700">
                    {selectedCategory}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      {renderImage(item.image)}
                      <h3 className="text-xl font-bold text-orange-700 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-black">ETB {item.price}</span>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className={`px-4 py-2 rounded-lg font-medium transition shadow-md ${
                            item.available
                              ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:from-orange-500 hover:to-rose-500"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                          disabled={!item.available}
                        >
                          {item.available ? "Add to Cart" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 