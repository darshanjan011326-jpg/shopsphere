/**
 * ShopSphere frontend data contract.
 *
 * Field names intentionally mirror the supplied Spring Boot/MySQL schema.
 * These interfaces are transport models for Thymeleaf/API integration and do
 * not replace server-side validation, authorization, or database constraints.
 */

export type UserRole = "USER" | "ADMIN";
export type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export interface UserRecord {
  id: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface CategoryRecord {
  id: number;
  name: string;
  description: string;
}

export interface ProductRecord {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string;
}

export interface CartItemRecord {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
}

export interface OrderRecord {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
}

export interface OrderItemRecord {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface WishlistRecord {
  id: number;
  user_id: number;
  product_id: number;
}

export interface ReviewRecord {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ShopSphereDataSet {
  users: UserRecord[];
  categories: CategoryRecord[];
  products: ProductRecord[];
  cart_items: CartItemRecord[];
  orders: OrderRecord[];
  order_items: OrderItemRecord[];
  wishlist: WishlistRecord[];
  reviews: ReviewRecord[];
}

export const API_ROUTES = {
  auth: "/api/auth",
  products: "/api/products",
  categories: "/api/categories",
  cart: "/api/cart",
  orders: "/api/orders",
  payment: "/api/payment",
  users: "/api/users",
  admin: "/api/admin",
} as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: "Order placed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
