"use client";
import { useState, useEffect, useRef } from "react";
import { MenuItem, MenuCategory, MenuFormData } from "@/types/menu";
import { 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  getMenuItems,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories
} from "@/lib/menuService";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { CATEGORY_OPTIONS } from "@/data/categories";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    available: true,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    emoji: "",
    order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, cats] = await Promise.all([
        getMenuItems(),
        getCategories()
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await addMenuItem(formData);
      }
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        available: true,
      });
      setEditingItem(null);
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
      } else {
        await addCategory(categoryFormData);
      }
      setCategoryFormData({
        name: "",
        description: "",
        emoji: "",
        order: 0,
      });
      setEditingCategory(null);
      setShowCategoryForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
    });
    setShowAddForm(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      emoji: category.emoji,
      order: category.order,
    });
    setShowCategoryForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(id);
        loadData();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        loadData();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError("");
      console.log("Starting Cloudinary upload...");
      
      const imageUrl = await uploadImageToCloudinary(file);
      console.log("Image uploaded successfully:", imageUrl);
      
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Error uploading image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    const category = CATEGORY_OPTIONS.find(cat => cat.name === categoryName);
    if (category) {
      setCategoryFormData({
        ...categoryFormData,
        name: category.name,
        emoji: category.emoji,
        description: category.description,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Categories Management */}
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-700">Categories</h2>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-500 transition shadow-md"
          >
            Add Category
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{category.emoji}</span>
                <h3 className="font-bold text-orange-700">{category.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Management */}
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-700">Menu Items</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md"
          >
            Add Menu Item
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border border-orange-200">
              <div className="mb-4 text-center">
                {item.image && item.image.startsWith('http') ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-64 object-cover rounded-lg mx-auto shadow-md"
                    onError={(e) => {
                      console.log("Image failed to load:", item.image);
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-6xl">
                    {item.image || '🍽️'}
                  </div>
                )}
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-2">
                  Image: {item.image ? (item.image.length > 50 ? item.image.substring(0, 50) + '...' : item.image) : 'No image'}
                </div>
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2 text-sm">{item.description}</p>
              <p className="text-2xl font-bold text-black mb-2">ETB {item.price}</p>
              <p className="text-sm text-gray-500 mb-3">Category: {item.category}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Menu Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-orange-700 mb-6">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                rows={3}
                required
              />
              <input
                type="number"
                placeholder="Price (ETB)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                step="0.01"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Item Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : "Choose Image"}
                  </button>
                  {formData.image && (
                    <div className="flex items-center space-x-2">
                      {formData.image.startsWith('http') ? (
                        <img 
                          src={formData.image} 
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-2xl">{formData.image}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: ""})}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}
                {uploadingImage && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">Uploading image...</span>
                  </div>
                )}
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="mr-2"
                />
                Available
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
                >
                  {editingItem ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: 0,
                      category: "",
                      image: "",
                      available: true,
                    });
                    setUploadError("");
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-orange-700 mb-6">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Category Type</label>
                <select
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
                >
                  <option value="">Select from common categories</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Category Name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Emoji"
                value={categoryFormData.emoji}
                onChange={(e) => setCategoryFormData({...categoryFormData, emoji: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                rows={3}
              />
              <input
                type="number"
                placeholder="Display Order"
                value={categoryFormData.order}
                onChange={(e) => setCategoryFormData({...categoryFormData, order: parseInt(e.target.value)})}
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-400 to-blue-400 text-white py-3 rounded-lg font-medium hover:from-green-500 hover:to-blue-500 transition"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setCategoryFormData({
                      name: "",
                      description: "",
                      emoji: "",
                      order: 0,
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 