// Database types
export interface Category {
  id: number;
  name: string;
  slug: string;
  name_en?: string;
  name_mn?: string;
  display_order?: number;
  is_active?: boolean;
  show_in_header?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: string;
  name_en?: string;
  name_mn?: string;
  brand?: string;
  sku?: string;
  price?: number;
  original_price?: number;
  discount?: number;
  stock?: number;
  sizes?: number[];
  description?: string;
  subcategory?: string;
  category_id?: number;
  brand_color?: string;
  image_color?: string;
  has_financing?: boolean;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  xp: number;
  tier_level: number;
  email: string | null;
  phone_number: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  earned_xp: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  size: number | null;
  price_at_purchase: number;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ProductView {
  id: string;
  user_id: string | null;
  product_id: string;
  viewed_at: string;
  session_id: string | null;
}

// Error types
export interface AuthError extends Error {
  message: string;
  status?: number;
}

export interface DatabaseError extends Error {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Utility function to safely get error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Тодорхойгүй алдаа гарлаа';
}
