# Advanced Website Data Integration

## Current state

ShopSphere now has a schema-aligned frontend contract in `client/src/lib/data-schema.ts`, a MySQL reference schema in `docs/schema.sql`, and an API-ready catalog service in `client/src/lib/catalog-service.ts`. The current demonstration remains usable without a backend because it uses realistic in-memory catalog data.

## API-first replacement strategy

The catalog service is designed around an API-first transition. Spring Boot should return `ProductRecord` objects with the exact fields from the requested schema:

```json
{
  "id": 1,
  "name": "Arc wireless headphones",
  "description": "Immersive studio sound...",
  "price": 129.00,
  "stock": 23,
  "category_id": 1,
  "image_url": "https://..."
}
```

The UI can enrich that response with presentation fields such as ratings, review counts, discount labels, and category names. These fields should be calculated from related records or returned by dedicated DTOs rather than stored redundantly in the `products` table.

## Recommended Spring Boot endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/products` | Search, filter, sort, and paginate products |
| `GET /api/products/{id}` | Product details, category, rating summary, and reviews |
| `GET /api/categories` | Category navigation and filter options |
| `GET /api/cart` | Current authenticated user's cart |
| `POST /api/cart/items` | Add a product to the cart |
| `PATCH /api/cart/items/{id}` | Update quantity |
| `DELETE /api/cart/items/{id}` | Remove an item |
| `POST /api/orders` | Validate cart, reserve stock, and create order transactionally |
| `GET /api/orders` | Current user's order history |
| `GET /api/orders/{id}` | Order detail and tracking timeline |
| `POST /api/payment/simulate` | Test-only payment state transition |
| `GET /api/admin/dashboard` | Admin statistics, inventory, and recent orders |

## Production requirements

Spring Security should protect cart, order, profile, review, and admin endpoints. The browser must never be trusted for price, stock, role, or total amount. Recalculate these values on the server using `BigDecimal` and a transaction.

Use DTOs for API responses. Do not serialize JPA entities directly. Do not return `users.password`. Validate `rating` between 1 and 5, `quantity` above zero, and product prices and stock as non-negative values.

## Connecting the website

When the backend is available, replace the mock catalog read with `fetchProductRecords` and map each returned record through `toCatalogView`. Preserve the current routes and UI behavior. This allows the website to move from demonstration data to MySQL-backed data without changing product cards, search controls, cart flows, or admin views.

The API service deliberately returns `null` when the backend is unavailable. That behavior keeps the demo resilient during frontend development and can later be changed to a visible network-error state once the backend becomes mandatory.
