
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
  colors?: string[];
  materials?: string[];
  default_color?: string;
  default_material?: string;
  description?: string;
  subcategory?: string;
  category_id?: number;
  brand_color?: string;
  image_color?: string;
  has_financing?: boolean;
  images?: string[];
  image_url?: string; // Single image URL (for queries that select single image)
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id?: string;
  product_id: string;
  color?: string;
  material?: string;
  size?: number;
  sku?: string;
  stock: number;
  price_adjustment?: number;
  images?: string[];
  is_active?: boolean;
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
  referral_code?: string;
  coin_balance: number;
  is_top6: boolean;
  promo_code: string | null;
  accumulated_discount_percent: number;
  total_referrals: number;
  created_at?: string;
  updated_at?: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'purchase' | 'spend' | 'refund';
  description: string | null;
  order_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  earned_xp: number;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  zip?: string | null;
  note?: string | null;
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

export interface Referral {
  id: string;
  user_id: string;
  referrer_id: string;
  promo_code_used: string;
  created_at: string;
}

export interface DiscountEvent {
  id: string;
  user_id: string;
  earned_from_user_id: string;
  purchase_order_id: string | null;
  discount_percent: number;
  purchase_amount_mnt: number;
  created_at: string;
}

export interface ReferralStats {
  referral_count: number;
  accumulated_discount_percent: number;
  purchases_30d: number;
  can_use_discount: boolean;
  total_discount_earned: number;
  threshold_30m: number;
  threshold_5m: number;
}

export interface ReferredUser {
  id: string;
  display_name: string;
  created_at: string;
  total_purchases: number;
}

export interface Top6Member extends Profile {
  stats: {
    total_referrals: number;
    total_discount_earned: number;
    network_size: number;
  };
}

export interface ReferralNetworkNode {
  id: string;
  user_id: string;
  name: string;
  promo_code: string | null;
  referral_count: number;
  discount_percent: number;
  is_top6: boolean;
  children: ReferralNetworkNode[];
  level: number;
}

// =====================================================
// SPIN WHEEL SYSTEM TYPES
// =====================================================

export interface SpinProduct {
  id: string;
  product_id: string;
  is_active: boolean;
  display_name: string | null;
  image_url: string | null;
  added_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined product data
  product?: Product;
}

export interface SpinHistory {
  id: string;
  user_id: string;
  spin_product_id: string;
  product_id: string;
  amount_paid: number;
  payment_method: 'mnt' | 'coin';
  won_at: string;
  added_to_cart: boolean;
  cart_id: string | null;
  spin_session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  // Joined data
  product?: Product;
  spin_product?: SpinProduct;
}

export interface SpinEligibility {
  can_spin: boolean;
  reason: string;
  last_spin_at: string | null;
  next_spin_at: string | null;
  active_products_count: number;
  cost_coins?: number;
  required_coins?: number;
  current_balance?: number;
}

export interface SpinResult {
  success: boolean;
  error?: string;
  spin_history_id?: string;
  won_product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  new_coin_balance?: number;
  added_to_cart?: boolean;
  cart_id?: string;
  eligibility?: SpinEligibility;
}

export interface SpinStatistics {
  period_days: number;
  total_spins: number;
  total_revenue_mnt: number;
  unique_users: number;
  avg_spins_per_user: number;
  most_won_products: Array<{
    id: string;
    name: string;
    image_url: string;
    win_count: number;
    win_percentage: number;
  }>;
}

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


export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    if ('message' in error) return String((error as { message: unknown }).message);
    if ('msg' in error) return String((error as { msg: unknown }).msg);
  }
  return 'Тодорхойгүй алдаа гарлаа';
}
