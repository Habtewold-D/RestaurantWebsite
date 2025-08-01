import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase";
import { Review, CreateReviewData } from "@/types/menu";

// Add a review to a menu item
export const addReview = async (reviewData: CreateReviewData): Promise<string> => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      ...reviewData,
      createdAt: serverTimestamp(),
      approved: true, // Auto-approve all reviews
    });

    // Update the menu item with the new review
    const menuItemRef = doc(db, "menuItems", reviewData.menuItemId);
    const menuItemDoc = await getDoc(menuItemRef);
    
    if (menuItemDoc.exists()) {
      const menuItemData = menuItemDoc.data();
      const currentReviews = menuItemData.reviews || [];
      const currentTotalReviews = menuItemData.totalReviews || 0;
      const currentAverageRating = menuItemData.averageRating || 0;
      
      // Calculate new average rating
      const newTotalReviews = currentTotalReviews + 1;
      const newAverageRating = ((currentAverageRating * currentTotalReviews) + reviewData.rating) / newTotalReviews;
      
      // Add review to menu item
      await updateDoc(menuItemRef, {
        reviews: arrayUnion({
          id: reviewRef.id,
          menuItemId: reviewData.menuItemId, // Add menuItemId
          userId: reviewData.userId,
          userName: reviewData.userName,
          userEmail: reviewData.userEmail,
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: serverTimestamp(),
          approved: true,
        }),
        totalReviews: newTotalReviews,
        averageRating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal place
        updatedAt: serverTimestamp(),
      });
    }

    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Get reviews for a specific menu item
export const getMenuItemReviews = async (menuItemId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("menuItemId", "==", menuItemId),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error("Error getting menu item reviews:", error);
    throw error;
  }
};

// Get all reviews (for admin)
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error("Error getting all reviews:", error);
    throw error;
  }
};

// Update review approval status (for admin)
export const updateReviewApproval = async (reviewId: string, approved: boolean): Promise<void> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      approved,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating review approval:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string, menuItemId: string): Promise<void> => {
  try {
    // Get the review data first
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewRef);
    
    if (reviewDoc.exists()) {
      const reviewData = reviewDoc.data();
      
      // Delete the review document
      await deleteDoc(reviewRef);
      
      // Update the menu item to remove the review and recalculate ratings
      const menuItemRef = doc(db, "menuItems", menuItemId);
      const menuItemDoc = await getDoc(menuItemRef);
      
      if (menuItemDoc.exists()) {
        const menuItemData = menuItemDoc.data();
        const currentReviews = menuItemData.reviews || [];
        
        // Remove the review from the array
        const updatedReviews = currentReviews.filter((review: any) => review.id !== reviewId);
        
        // Recalculate average rating
        let newAverageRating = 0;
        let newTotalReviews = updatedReviews.length;
        
        if (newTotalReviews > 0) {
          const totalRating = updatedReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          newAverageRating = Math.round((totalRating / newTotalReviews) * 10) / 10;
        }
        
        await updateDoc(menuItemRef, {
          reviews: updatedReviews,
          totalReviews: newTotalReviews,
          averageRating: newAverageRating,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Get reviews by user
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw error;
  }
}; 