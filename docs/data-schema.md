# ShopSphere Data Schema

## Purpose

This document translates the supplied internship database schema into a frontend integration contract. The naming is intentionally unchanged so the React prototype can connect to Spring Boot, Hibernate/JPA, Thymeleaf, and MySQL without renaming fields during integration.

## Tables

| Table | Description | Key fields |
|---|---|---|
| `users` | User account information | `id`, `email`, `password`, `first_name`, `last_name`, `role` |
| `categories` | Product categories | `id`, `name`, `description` |
| `products` | Product catalog | `id`, `name`, `description`, `price`, `stock`, `category_id`, `image_url` |
| `cart_items` | User shopping cart | `id`, `user_id`, `product_id`, `quantity` |
| `orders` | Order information | `id`, `user_id`, `order_date`, `total_amount`, `status`, `shipping_address` |
| `order_items` | Order line items | `id`, `order_id`, `product_id`, `quantity`, `price` |
| `wishlist` | User wishlist | `id`, `user_id`, `product_id` |
| `reviews` | Product reviews | `id`, `user_id`, `product_id`, `rating`, `comment`, `created_at` |

## Relationships

| Parent | Child | Relationship |
|---|---|---|
| `users` | `cart_items` | One user has many cart items |
| `users` | `orders` | One user has many orders |
| `users` | `wishlist` | One user has many wishlist entries |
| `users` | `reviews` | One user has many reviews |
| `categories` | `products` | One category has many products |
| `products` | `cart_items` | One product can appear in many carts |
| `products` | `order_items` | One product can appear in many order lines |
| `products` | `wishlist` | One product can be saved by many users |
| `products` | `reviews` | One product has many reviews |
| `orders` | `order_items` | One order has many order lines |

## Field Rules

`users.email` should be unique and normalized to lowercase. Passwords must be stored only as BCrypt hashes by Spring Security; the frontend contract marks `password` as optional so it is not accidentally returned in normal responses.

`products.price`, `orders.total_amount`, and `order_items.price` should use a decimal type in MySQL and `BigDecimal` in Java. The `order_items.price` field must preserve the product price at the time of purchase.

`products.stock` and every quantity field must be a non-negative integer. The server must re-check stock inside the order transaction rather than trusting the browser value.

`reviews.rating` should be constrained to integers from 1 through 5. A unique constraint on `(user_id, product_id)` is recommended if one review per customer per product is intended.

`cart_items` should have a unique constraint on `(user_id, product_id)` so adding the same product increases `quantity` instead of creating duplicate rows. `wishlist` should have the same composite uniqueness rule.

`orders.status` should use the following values:

```text
PLACED
PROCESSING
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
```

## Frontend Contract

The corresponding TypeScript interfaces are located at `client/src/lib/data-schema.ts`. They preserve the exact snake_case field names from the requested schema. The current product cards use a presentation model, while the integration layer can map `ProductRecord.image_url`, `ProductRecord.category_id`, and the remaining database fields into that model.

The expected API base resources are:

```text
/api/auth
/api/products
/api/categories
/api/cart
/api/orders
/api/payment
/api/users
/api/admin
```

The current website uses mock state so it can be demonstrated without a backend. When Spring Boot is connected, replace mock operations with service calls while keeping the route and field contracts stable.

## Integration Checklist

- Map Java entities to the eight table names without changing the public field contract.
- Use `@Enumerated(EnumType.STRING)` for order status values.
- Use DTOs rather than returning JPA entities directly.
- Apply `@Valid` to registration, product, checkout, and review request DTOs.
- Recalculate cart totals and validate stock on the server.
- Do not return `password` in user, profile, admin, or order responses.
- Add foreign keys for every `*_id` field.
- Add indexes on `products.category_id`, `orders.user_id`, `orders.status`, and review product lookups.
