export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  // New fields for reviews and ratings
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  emoji: string; // Added emoji field
  order: number;
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

// New interfaces for reviews
export interface Review {
  id: string;
  menuItemId: string; // Add this field
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
  approved: boolean; // For admin moderation
}

export interface CreateReviewData {
  menuItemId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
} 