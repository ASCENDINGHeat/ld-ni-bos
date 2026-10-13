# REST API Reference

Complete reference of all REST API endpoints for **LD-NI-BOS**.

---

## 1. General Conventions

- **Base URL**: `http://127.0.0.1:8000/api`
- **Headers**:
  ```http
  Accept: application/json
  Content-Type: application/json
  ```
- **Authentication**: Endpoints marked with 🔒 require:
  ```http
  Authorization: Bearer <personal_access_token>
  ```
- **Response Format**: Standard JSON responses with appropriate HTTP status codes (`200 OK`, `201 Created`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`).

---

## 2. API Endpoints Overview

| Area | Method | Endpoint | Auth | Description |
|---|---|---|:---:|---|
| **Auth** | `POST` | `/api/register` | Public | Register new customer account |
| **Auth** | `POST` | `/api/login` | Public | Authenticate user & issue bearer token |
| **Auth** | `GET` | `/api/user` | 🔒 | Get authenticated user profile |
| **Auth** | `POST` | `/api/logout` | 🔒 | Revoke current access token |
| **Catalog** | `GET` | `/api/categories` | Public | List all hardware categories |
| **Catalog** | `GET` | `/api/categories/{slug}` | Public | Show category detail |
| **Catalog** | `GET` | `/api/products` | Public | Paginated, filterable product catalog |
| **Catalog** | `GET` | `/api/products/{slug}` | Public | Detailed product data with specs |
| **Catalog** | `GET` | `/api/products/{slug}/related` | Public | Related category products |
| **Wishlist** | `GET` | `/api/wishlist` | 🔒 | List user's wishlisted items |
| **Wishlist** | `POST` | `/api/wishlist` | 🔒 | Add product to wishlist |
| **Wishlist** | `POST` | `/api/wishlist/toggle` | 🔒 | Toggle product in wishlist |
| **Wishlist** | `DELETE`| `/api/wishlist/{productId}` | 🔒 | Remove item from wishlist |
| **Cart** | `GET` | `/api/cart` | 🔒 | List user cart with price & quantity summary |
| **Cart** | `POST` | `/api/cart` | 🔒 | Add or increment item in cart |
| **Cart** | `POST` | `/api/cart/bulk` | 🔒 | Bulk add items to cart (e.g. PC builder) |
| **Cart** | `PATCH`| `/api/cart/{cartItemId}` | 🔒 | Update quantity of a cart item |
| **Cart** | `DELETE`| `/api/cart/{cartItemId}` | 🔒 | Remove single item from cart |
| **Cart** | `DELETE`| `/api/cart` | 🔒 | Empty entire shopping cart |
| **Orders** | `POST` | `/api/checkout` | 🔒 | Unified checkout (supports direct items or cart) |
| **Orders** | `POST` | `/api/orders/checkout` | 🔒 | Dedicated cart-to-order checkout |
| **Orders** | `GET` | `/api/orders` | 🔒 | List user's order history |
| **Orders** | `GET` | `/api/orders/{id}` | 🔒 | View single order with items |
| **Orders** | `PATCH`| `/api/orders/{id}/cancel` | 🔒 | Cancel pending/paid order & restore inventory |
| **Vendor** | `GET` | `/api/vendor/store` | 🔒 Vendor | Fetch vendor store profile |
| **Vendor** | `POST` | `/api/vendor/store` | 🔒 Vendor | Register new vendor store |
| **Vendor** | `PATCH`| `/api/vendor/store` | 🔒 Vendor | Update vendor store profile |
| **Vendor** | `GET` | `/api/vendor/products` | 🔒 Vendor | List vendor's owned products |
| **Vendor** | `POST` | `/api/vendor/products` | 🔒 Vendor | Create new vendor product |
| **Vendor** | `PATCH`| `/api/vendor/products/{product}` | 🔒 Vendor | Update vendor product |
| **Vendor** | `DELETE`| `/api/vendor/products/{product}` | 🔒 Vendor | Delete vendor product |
| **Vendor** | `GET` | `/api/vendor/dashboard` | 🔒 Vendor | Vendor sales & order metrics |
| **Vendor** | `GET` | `/api/vendor/orders` | 🔒 Vendor | Orders containing vendor's items |
| **Vendor** | `PATCH`| `/api/vendor/orders/{order}/status` | 🔒 Vendor | Update status of vendor's order items |

---

## 3. Detailed Specifications

### 3.1 Catalog Endpoints

#### `GET /api/products`
Query parameters:
- `search` (string): Search across name, brand, description
- `category` (string|int): Category slug or ID
- `type` (string): `'prebuilt'` or `'part'`
- `per_page` (int): Items per page (default: 12)
- `sort` (string): `'price_asc'`, `'price_desc'`, `'latest'`

Sample Response (`200 OK`):
```json
{
  "data": [
    {
      "id": 1,
      "category_id": 2,
      "vendor_id": 1,
      "sku": "CPU-14900K",
      "name": "Intel Core i9-14900K",
      "slug": "intel-core-i9-14900k",
      "type": "part",
      "brand": "Intel",
      "price": 9850000.0,
      "formatted_price": "Rp 9.850.000",
      "stock": 10,
      "is_in_stock": true,
      "description": "24 cores flagship processor...",
      "specifications": { "socket": "LGA1700", "tdp": 125 },
      "image_url": "https://...",
      "images": ["https://..."],
      "is_active": true,
      "weight_grams": 450,
      "category": { "id": 2, "name": "Processor", "slug": "processor" },
      "is_wishlisted": false
    }
  ],
  "links": { ... },
  "meta": { "total": 1, ... }
}
```

#### `GET /api/products/{slug}`
Fetches full details for a product by slug or numeric ID.

Sample Response (`200 OK`):
```json
{
  "data": {
    "id": 1,
    "category_id": 2,
    "vendor_id": 1,
    "sku": "CPU-14900K",
    "name": "Intel Core i9-14900K",
    "slug": "intel-core-i9-14900k",
    "type": "part",
    "brand": "Intel",
    "price": 9850000.0,
    "formatted_price": "Rp 9.850.000",
    "stock": 10,
    "is_in_stock": true,
    "description": "24 cores flagship processor...",
    "specifications": {
      "socket": "LGA1700",
      "tdp": 125,
      "warranty": "3 Tahun Garansi Resmi"
    },
    "image_url": "https://...",
    "images": ["https://..."],
    "is_active": true,
    "weight_grams": 450,
    "category": { "id": 2, "name": "Processor", "slug": "processor" },
    "vendor": { "id": 1, "store_name": "Tech Hardware Store", "store_slug": "tech-hardware-store" }
  }
}
```

#### `GET /api/products/{slug}/related`
Returns up to 4 related products in the same category or hardware type.

#### `GET /api/categories`
Returns all active product categories with active product counts.

Sample Response (`200 OK`):
```json
{
  "data": [
    {
      "id": 1,
      "name": "PC Siap Pakai",
      "slug": "pc-siap-pakai",
      "description": "Desktop PC pre-built siap pakai untuk gaming dan kerja",
      "icon": "desktop",
      "products_count": 3
    },
    {
      "id": 2,
      "name": "Processor",
      "slug": "processor",
      "description": "CPU Intel Core & AMD Ryzen",
      "icon": "cpu",
      "products_count": 8
    }
  ]
}
```

#### `GET /api/categories/{slug}`
Returns category detail with product count by category slug or ID.

---

### 3.2 Wishlist Endpoints

#### `GET /api/wishlist` 🔒
Returns paginated list of user's bookmarked products.

#### `POST /api/wishlist` 🔒
Adds a product to the user's wishlist (idempotent).
Payload:
```json
{
  "product_id": 1
}
```

#### `POST /api/wishlist/toggle` 🔒
Toggles a product's presence in the user's wishlist.
Payload:
```json
{
  "product_id": 1
}
```
Response (`200 OK` or `201 Created`):
```json
{
  "message": "Product added to wishlist",
  "wishlisted": true,
  "wishlist": { ... }
}
```

#### `DELETE /api/wishlist/{productId}` 🔒
Removes a specific product from the wishlist.

---

### 3.3 Shopping Cart Endpoints

#### `GET /api/cart` 🔒
Retrieves active cart line items and calculated totals:

Sample Response (`200 OK`):
```json
{
  "items": [
    {
      "id": 1,
      "user_id": 5,
      "product_id": 1,
      "quantity": 2,
      "subtotal": 19700000.0,
      "product": { ... }
    }
  ],
  "summary": {
    "total_unique_items": 1,
    "total_quantity": 2,
    "total_price": 19700000.0,
    "formatted_total_price": "Rp 19.700.000"
  }
}
```

#### `POST /api/cart` 🔒
Adds a single product or accepts an `items` array.
Single item payload:
```json
{
  "product_id": 1,
  "quantity": 1
}
```

#### `POST /api/cart/bulk` 🔒
Bulk adds multiple products to the cart in a single atomic database transaction. Built specifically for the interactive PC Builder configuration.

Supports resolving products by:
1. Numeric product ID: `1`
2. Product slug: `"intel-core-i9-14900k"`
3. PC Builder mock code alias: `"cpu-1"`, `"mb-1"`, `"vga-1"`, `"ram-1"`, `"ssd-1"`, `"psu-1"`, `"casing-1"`.

Payload:
```json
{
  "items": [
    { "product_id": 1, "quantity": 1 },
    { "product_id": "vga-1", "quantity": 1 },
    { "id": "ram-1", "quantity": 2 }
  ]
}
```

Response (`201 Created`):
```json
{
  "message": "3 produk berhasil dimasukkan ke keranjang",
  "items": [ ... ],
  "summary": {
    "total_unique_items": 3,
    "total_quantity": 4,
    "total_price": 32500000.0,
    "formatted_total_price": "Rp 32.500.000"
  }
}
```

#### `PATCH /api/cart/{cartItemId}` 🔒
Updates quantity for a cart line item.
Payload:
```json
{
  "quantity": 3
}
```

#### `DELETE /api/cart/{cartItemId}` 🔒
Removes a single cart line item.

#### `DELETE /api/cart` 🔒
Clears all items in the user's shopping cart.

---

### 3.4 Checkout & Order Endpoints

#### `POST /api/checkout` 🔒

The unified checkout endpoint supports both direct item lists and cart conversion:

**Modality A: Itemized Checkout (Frontend Direct)**:
```json
{
  "items": [
    { "product_id": 1, "quantity": 1 }
  ],
  "payment_method": "bank-transfer",
  "shipping_method": "regular",
  "recipient_name": "Budi Santoso",
  "recipient_phone": "081234567890",
  "shipping_address": "Jl. Sudirman No. 45, Jakarta Selatan",
  "customer_note": "Tolong packing kayu"
}
```

**Modality B: Cart-Based Checkout**:
```json
{
  "payment_method": "simulated_wallet",
  "shipping_address": "Jl. Sudirman No. 45, Jakarta",
  "shipping_phone": "081234567890",
  "notes": "Pesanan dari keranjang"
}
```

Response (`201 Created`):
```json
{
  "message": "Order created successfully.",
  "order": {
    "id": 12,
    "order_number": "PCS-20261013-ABC123",
    "status": "pending",
    "payment_method": "bank-transfer",
    "shipping_method": "regular",
    "recipient_name": "Budi Santoso",
    "recipient_phone": "081234567890",
    "shipping_address": "Jl. Sudirman No. 45, Jakarta Selatan",
    "subtotal": 9850000.0,
    "shipping_cost": 0.0,
    "total": 9850000.0,
    "is_cancellable": true,
    "items": [
      {
        "id": 20,
        "product_id": 1,
        "vendor_id": 1,
        "product_name": "Intel Core i9-14900K",
        "product_sku": "CPU-14900K",
        "unit_price": 9850000.0,
        "quantity": 1,
        "subtotal": 9850000.0,
        "status": "pending"
      }
    ]
  }
}
```

#### `POST /api/orders/checkout` 🔒
Dedicated cart-to-order checkout endpoint. Converts the user's active cart into a confirmed order, deducts inventory, and empties the cart.

#### `GET /api/orders` 🔒
Lists paginated orders placed by the authenticated customer.

#### `GET /api/orders/{id}` 🔒
Fetches a single customer order with itemized products and fulfillment status.

#### `PATCH /api/orders/{id}/cancel` 🔒
Cancels an order if status is `pending` or `paid`. Automatically restores stock inventory for all items in the order.

---

### 3.5 Vendor Portal Endpoints

#### `GET /api/vendor/store` 🔒 (Vendor)
Returns the vendor store profile for the authenticated vendor user.

#### `POST /api/vendor/store` 🔒 (Vendor)
Registers a new vendor store for the authenticated user (enforces one store per user).
Payload:
```json
{
  "store_name": "Tech Hardware Store",
  "description": "Toko resmi komponen PC & aksesoris",
  "phone": "08123456789",
  "address": "Mangga Dua Mall Lt. 3 No. 45",
  "city": "Jakarta Pusat",
  "province": "DKI Jakarta",
  "postal_code": "10730"
}
```

#### `PATCH /api/vendor/store` 🔒 (Vendor)
Updates store profile details. Automatically synchronizes `store_slug` if `store_name` changes.

#### `GET /api/vendor/products` 🔒 (Vendor)
Lists paginated products owned by the vendor store.

#### `POST /api/vendor/products` 🔒 (Vendor)
Creates a new product attributed to the vendor's store.
Payload:
```json
{
  "category_id": 2,
  "sku": "CPU-RYZEN-7800X3D",
  "name": "AMD Ryzen 7 7800X3D",
  "brand": "AMD",
  "price": 6850000,
  "stock": 15,
  "description": "Gaming champion processor...",
  "specifications": { "socket": "AM5", "tdp": 120 },
  "image_url": "https://..."
}
```

#### `PATCH /api/vendor/products/{product}` 🔒 (Vendor)
Updates an existing product owned by the vendor.

#### `DELETE /api/vendor/products/{product}` 🔒 (Vendor)
Deletes a product owned by the vendor.

#### `GET /api/vendor/dashboard` 🔒 (Vendor)
Returns real-time sales and order metrics:
```json
{
  "store": {
    "id": 1,
    "store_name": "Tech Hardware Store",
    "store_slug": "tech-hardware-store",
    "is_verified": true,
    "products_count": 8
  },
  "metrics": {
    "gross_sales": 25400000.0,
    "products_sold": 14,
    "active_products": 8,
    "new_orders": 3
  }
}
```

#### `GET /api/vendor/orders` 🔒 (Vendor)
Lists paginated orders that contain items belonging to this vendor.

#### `PATCH /api/vendor/orders/{order}/status` 🔒 (Vendor)
Updates fulfillment status for vendor's items inside the order:
Payload:
```json
{
  "status": "shipped"
}
```
Available statuses: `'processing'`, `'shipped'`, `'completed'`, `'cancelled'`.
When set to `'cancelled'`, item inventory is automatically incremented and restored. If all vendors update their items to the same status, parent order status is updated accordingly.

