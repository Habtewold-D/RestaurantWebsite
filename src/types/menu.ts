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
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  emoji: string;
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