import type { CategoryRecord, ProductRecord } from "./data-schema";

export interface CatalogViewProduct extends ProductRecord {
  category: string;
  rating: number;
  reviews: number;
  original_price?: number;
  badge?: string;
  tone?: string;
}

export interface CatalogQuery {
  q?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "rating" | "newest";
  available_only?: boolean;
}

export const catalogApi = {
  products: "/api/products",
  categories: "/api/categories",
  cart: "/api/cart",
  orders: "/api/orders",
  auth: "/api/auth",
};

/** Convert the current presentation model into the requested database contract. */
export function toProductRecord(product: CatalogViewProduct): ProductRecord {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    image_url: product.image_url,
  };
}

/** Add presentation-only fields after a ProductRecord is returned by Spring Boot. */
export function toCatalogView(product: ProductRecord, category?: CategoryRecord): CatalogViewProduct {
  return {
    ...product,
    category: category?.name ?? "Collection",
    rating: 0,
    reviews: 0,
    tone: "#e7e5dc",
  };
}

export function buildProductQuery(query: CatalogQuery = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category_id) params.set("category_id", String(query.category_id));
  if (query.min_price !== undefined) params.set("min_price", String(query.min_price));
  if (query.max_price !== undefined) params.set("max_price", String(query.max_price));
  if (query.sort) params.set("sort", query.sort);
  if (query.available_only) params.set("available_only", "true");
  return params.toString();
}

/**
 * API-first loader. It is intentionally opt-in so the static demo continues to
 * work before Spring Boot is running. When the API is available, the same UI
 * can consume database-backed ProductRecord values.
 */
export async function fetchProductRecords(query: CatalogQuery = {}): Promise<ProductRecord[] | null> {
  try {
    const suffix = buildProductQuery(query);
    const response = await fetch(`${catalogApi.products}${suffix ? `?${suffix}` : ""}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as ProductRecord[];
  } catch {
    return null;
  }
}

export function getProductRecordMap(products: CatalogViewProduct[]) {
  return new Map(products.map((product) => [product.id, toProductRecord(product)]));
}
