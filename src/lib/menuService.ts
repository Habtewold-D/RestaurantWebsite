import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { MenuItem, MenuCategory, MenuFormData } from "@/types/menu";

// Menu Items
export const addMenuItem = async (menuData: MenuFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "menuItems"), {
      ...menuData,
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuData: Partial<MenuFormData>): Promise<void> => {
  try {
    const menuRef = doc(db, "menuItems", id);
    await updateDoc(menuRef, {
      ...menuData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const menuRef = doc(db, "menuItems", id);
    await deleteDoc(menuRef);
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Menu item ${doc.id} data:`, data);
      
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        available: data.available,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        reviews: data.reviews || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as MenuItem;
    });
    
    console.log("Processed menu items:", items);
    return items;
  } catch (error) {
    console.error("Error getting menu items:", error);
    throw error;
  }
};

// Update existing menu items to include rating fields if they don't exist
export const updateMenuItemsWithRatingFields = async (): Promise<void> => {
  try {
    const q = query(collection(db, "menuItems"));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.averageRating === undefined || data.totalReviews === undefined || data.reviews === undefined) {
        batch.update(doc.ref, {
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0,
          reviews: data.reviews || [],
          updatedAt: serverTimestamp(),
        });
      }
    });
    
    await batch.commit();
    console.log("Updated menu items with rating fields");
  } catch (error) {
    console.error("Error updating menu items with rating fields:", error);
    throw error;
  }
};

// Categories
export const addCategory = async (categoryData: Omit<MenuCategory, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<MenuCategory>): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, categoryData);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<MenuCategory[]> => {
  try {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        order: data.order,
      } as MenuCategory;
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
}; 