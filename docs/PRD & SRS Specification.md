# Product Requirements Document (PRD) & Software Requirements Specification (SRS)

**Project Name:** PBP Platform Commerce (Laravel + React Edition)  
**Based On:** `ASCENDINGHeat/project-pbp-uas` (Modernized Architecture)  
**Target Tech Stack:** Laravel 11 + React 18/19 (Inertia.js / Vite) + SQLite + Tailwind CSS  
**Integration Constraint:** No external payment gateway (simulated / instant checkout to enable end-to-end AI agent autonomous development and zero-dependency testing).

---

## 1. Executive Summary & Project Goal

This document defines the functional, technical, and architectural requirements for a full-stack platform commerce application originally conceived for university platform-based programming (PBP UAS).

To maximize development velocity and enable an **autonomous AI coding agent** (e.g., Cursor, Claude Code, Aider, Copilot Workspace) to implement and test the complete system without environment friction or external credentials, the architecture is unified around:
1. **Laravel 11** as the robust backend framework with built-in authentication, ORM (Eloquent), and validation.
2. **React with Inertia.js** (or Vite SPA) for modern frontend interactivity without the overhead of dual-server CORS configurations.
3. **SQLite** for a file-based, zero-configuration database that works instantly across any local or containerized environment.
4. **Internal Checkout Flow** replacing complex payment gateways (Stripe/Midtrans/PayPal) with a simulated instant-payment / manual payment confirmation workflow.

---

## 2. Target Personas & Roles

| Role | Description | Core Capabilities |
| :--- | :--- | :--- |
| **Guest** | Unauthenticated site visitor | Browse catalog, search/filter items, view item details, register/log in. |
| **Customer** | Authenticated buyer | Manage profile, add items to cart, adjust quantities, execute mock checkout, track order history. |
| **Admin** | Store/Platform manager | Manage product catalog (CRUD), monitor inventory, update order statuses, manage user accounts. |

---

## 3. Technology Stack Specification

```
+-------------------------------------------------------------+
|                     PRESENTATION LAYER                      |
|          React + Inertia.js + Tailwind CSS + Lucide Icons   |
+-------------------------------------------------------------+
                              | (Inertia Protocol / JSON)
+-------------------------------------------------------------+
|                     APPLICATION LAYER                       |
|           Laravel 11 (PHP 8.2+) / Eloquent ORM              |
|        Laravel Breeze (React) for Authentication Scaffolding |
+-------------------------------------------------------------+
                              | (PDO SQLite)
+-------------------------------------------------------------+
|                       DATABASE LAYER                        |
|             SQLite (`database/database.sqlite`)             |
+-------------------------------------------------------------+
```

* **Backend Framework:** Laravel 11.x
* **Frontend:** React 18/19, Inertia.js, Tailwind CSS v3/v4
* **Database:** SQLite 3 (file stored at `database/database.sqlite`)
* **Authentication:** Laravel Breeze (Inertia + React stack) utilizing session-based stateful authentication.
* **Payment Architecture:** Internal mock checkout (Order auto-transitions to `paid` or `pending_verification` without external webhooks).

---

## 4. Entity Relationship Diagram & Database Schema

### 4.1 ER Diagram (ASCII)

```
[ users ]
   │ 1
   │
   ├──────< [ orders ] 1 ───< [ order_items ] >─── 1 [ products ]
   │           │
   │           └───────────── [ payments (simulated) ]
   │
   └──────< [ carts ] 1 ─────< [ cart_items ] >─── 1 [ products ]
                                                           │
[ categories ] 1 ──────────────────────────────────────────┘ N
```

---

### 4.2 SQLite Table Definitions

#### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier |
| `name` | TEXT | NOT NULL | User's full name |
| `email` | TEXT | UNIQUE, NOT NULL | Login credential |
| `password` | TEXT | NOT NULL | Hashed password (Bcrypt) |
| `role` | TEXT | NOT NULL, DEFAULT 'customer' | `'admin'` or `'customer'` |
| `phone` | TEXT | NULLABLE | Contact telephone |
| `address` | TEXT | NULLABLE | Default shipping address |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

#### `categories`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique category identifier |
| `name` | TEXT | NOT NULL | Display name |
| `slug` | TEXT | UNIQUE, NOT NULL | URL-safe identifier |
| `description` | TEXT | NULLABLE | Category description |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

#### `products`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique product identifier |
| `category_id` | INTEGER | NOT NULL, FK -> `categories.id` | Category reference |
| `name` | TEXT | NOT NULL | Product name |
| `slug` | TEXT | UNIQUE, NOT NULL | URL-safe product slug |
| `description` | TEXT | NULLABLE | Detailed description |
| `price` | REAL | NOT NULL | Unit price (Decimal/Float) |
| `stock` | INTEGER | NOT NULL, DEFAULT 0 | Inventory count |
| `image_url` | TEXT | NULLABLE | Path or placeholder image link |
| `is_active` | INTEGER | NOT NULL, DEFAULT 1 | Boolean flag (1=Active, 0=Inactive) |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

#### `cart_items`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Primary Key |
| `user_id` | INTEGER | NOT NULL, FK -> `users.id` | Cart owner |
| `product_id` | INTEGER | NOT NULL, FK -> `products.id` | Selected product |
| `quantity` | INTEGER | NOT NULL, DEFAULT 1 | Selected quantity |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

#### `orders`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Primary Key |
| `order_number` | TEXT | UNIQUE, NOT NULL | Human-readable ID (e.g. `ORD-20261012-XXXX`) |
| `user_id` | INTEGER | NOT NULL, FK -> `users.id` | Order creator |
| `total_amount` | REAL | NOT NULL | Final cost of order |
| `status` | TEXT | NOT NULL, DEFAULT 'paid' | `'pending'`, `'paid'`, `'processing'`, `'shipped'`, `'completed'`, `'cancelled'` |
| `shipping_address` | TEXT | NOT NULL | Destination address |
| `shipping_phone` | TEXT | NOT NULL | Contact recipient phone |
| `payment_method` | TEXT | NOT NULL | `'simulated_wallet'`, `'bank_transfer_simulated'`, `'cod'` |
| `notes` | TEXT | NULLABLE | Buyer notes |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

#### `order_items`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Primary Key |
| `order_id` | INTEGER | NOT NULL, FK -> `orders.id` ON DELETE CASCADE | Parent order |
| `product_id` | INTEGER | NOT NULL, FK -> `products.id` | Snapshot reference |
| `product_name` | TEXT | NOT NULL | Snapshot of product title |
| `unit_price` | REAL | NOT NULL | Snapshot of unit price |
| `quantity` | INTEGER | NOT NULL | Quantity ordered |
| `subtotal` | REAL | NOT NULL | `unit_price * quantity` |
| `created_at` | DATETIME | NULLABLE | Timestamp |
| `updated_at` | DATETIME | NULLABLE | Timestamp |

---

## 5. Functional Requirements (FR)

### 5.1 Authentication & Authorization
* **FR-AUTH-01:** Users can register with name, email, password, and password confirmation.
* **FR-AUTH-02:** Users can log in using email and password, establishing an authenticated session.
* **FR-AUTH-03:** Users can log out, destroying session cookies.
* **FR-AUTH-04:** Middleware `auth` protects customer routes (`/cart`, `/checkout`, `/orders`).
* **FR-AUTH-05:** Middleware `admin` verifies `user.role === 'admin'`, guarding `/admin/*`.

### 5.2 Product Catalog & Search
* **FR-PROD-01:** The homepage and catalog page display active products with pagination (12 items/page).
* **FR-PROD-02:** Users can search products by name/description using query strings (`?search=term`).
* **FR-PROD-03:** Users can filter products by Category (`?category=slug`).
* **FR-PROD-04:** Product detail page shows high-res photo, price, available stock, description, and "Add to Cart" button.

### 5.3 Shopping Cart
* **FR-CART-01:** Authenticated users can add items to their persistent cart in the database.
* **FR-CART-02:** Adding an already present item increases its quantity up to `product.stock`.
* **FR-CART-03:** Users can update quantity or remove items directly on the Cart page.
* **FR-CART-04:** Cart automatically calculates line subtotals and grand total.

### 5.4 Simulated Checkout (No Payment Gateway)
* **FR-CHCK-01:** Users proceed from cart to checkout, providing shipping address and recipient phone.
* **FR-CHCK-02:** Users select a mock payment method:
  1. *Instant Simulated Balance* (Directly transitions order to `paid`).
  2. *Cash on Delivery (COD)* (Transitions order to `processing`).
  3. *Direct Bank Transfer Demo* (Shows simulated account number, instantly marks as `paid` upon confirmation click).
* **FR-CHCK-03:** Database Transaction verifies stock availability, decrements `product.stock`, creates `orders` and `order_items`, empties `cart_items`, and returns `order_number`.
* **FR-CHCK-04:** System redirects to Order Success / Receipt screen (`/orders/{order_number}`).

### 5.5 Order Management
* **FR-ORD-01:** Customer can view order history with status badges (`paid`, `shipped`, etc.).
* **FR-ORD-02:** Customer can view printable invoice / order details.
* **FR-ORD-03:** Admin can list all orders, filter by status, and mutate status via dropdown.

### 5.6 Admin Management
* **FR-ADM-01:** Admin dashboard displaying total sales, total orders, low-stock warnings, and recent activity.
* **FR-ADM-02:** Product CRUD (Create, Edit, Delete, Toggle active status) with validation.
* **FR-ADM-03:** Category CRUD with automatic slug generation.

---

## 6. Route & API Specifications

### 6.1 Public & Customer Routes (Inertia Web Routes)

| Method | Path | Controller Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `HomeController@index` | Landing page & featured catalog |
| `GET` | `/products` | `ProductController@index` | Catalog search & category filter |
| `GET` | `/products/{slug}` | `ProductController@show` | Product detail view |
| `GET` | `/cart` | `CartController@index` | User shopping cart |
| `POST` | `/cart` | `CartController@store` | Add item to cart |
| `PATCH` | `/cart/{cartItem}` | `CartController@update` | Update item quantity |
| `DELETE` | `/cart/{cartItem}` | `CartController@destroy` | Remove item from cart |
| `GET` | `/checkout` | `CheckoutController@index` | Checkout review page |
| `POST` | `/checkout` | `CheckoutController@store` | Process simulated order |
| `GET` | `/orders` | `OrderController@index` | Customer order history |
| `GET` | `/orders/{orderNumber}` | `OrderController@show` | Order receipt & invoice |

### 6.2 Admin Routes (`auth`, `admin` Middleware)

| Method | Path | Controller Action | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | `Admin\DashboardController@index` | Metrics & overview |
| `GET` | `/admin/products` | `Admin\ProductController@index` | Product table |
| `POST` | `/admin/products` | `Admin\ProductController@store` | Create product |
| `PUT` | `/admin/products/{id}` | `Admin\ProductController@update` | Update product |
| `DELETE` | `/admin/products/{id}` | `Admin\ProductController@destroy` | Delete product |
| `GET` | `/admin/categories` | `Admin\CategoryController@index` | Category table |
| `POST` | `/admin/categories` | `Admin\CategoryController@store` | Create category |
| `GET` | `/admin/orders` | `Admin\OrderController@index` | All customer orders |
| `PATCH` | `/admin/orders/{id}/status` | `Admin\OrderController@updateStatus` | Update order state |

---

## 7. Non-Functional Requirements & AI Agent Optimization

To guarantee that an AI agent can build, test, and run this system autonomously:

1. **Zero External API Dependencies:**  
   * No Stripe, Midtrans, or Mailgun API keys required.
   * Email verification set to disabled or simulated via `log` driver (`MAIL_MAILER=log`).
2. **Zero Native Database Engine Dependencies:**  
   * Configured for SQLite (`DB_CONNECTION=sqlite`).
   * Command to initialize: `touch database/database.sqlite && php artisan migrate:fresh --seed`.
3. **Realistic Seed Data:**  
   * Seeders must populate at least 1 Admin user, 2 Customer users, 4 Categories, and 20 realistic products with high quality Unsplash or SVG placeholder URLs.
4. **Resilient Error Handling:**  
   * Wrap checkout operations in `DB::transaction()` with pessimistic row locks (`lockForUpdate()`) to prevent race conditions during mock checkout stock deductions.

---

## 8. AI Agent Implementation Prompt & Action Plan

An AI developer or agent can implement this repository in 5 consecutive phases:

### Phase 1: Environment & Foundation
```bash
composer create-project laravel/laravel project-pbp
cd project-pbp
composer require laravel/breeze --dev
php artisan breeze:install react --typescript=false
touch database/database.sqlite
```
* Set `.env`:
  ```ini
  DB_CONNECTION=sqlite
  DB_DATABASE=database/database.sqlite
  MAIL_MAILER=log
  ```

### Phase 2: Migrations & Models
1. Create models with migrations:
   ```bash
   php artisan make:model Category -m
   php artisan make:model Product -m
   php artisan make:model CartItem -m
   php artisan make:model Order -m
   php artisan make:model OrderItem -m
   ```
2. Implement schema structures according to Section 4.2.
3. Configure Eloquent relationships:
   * `User` hasMany `Order`, hasMany `CartItem`.
   * `Product` belongsTo `Category`, hasMany `CartItem`, hasMany `OrderItem`.
   * `Order` belongsTo `User`, hasMany `OrderItem`.

### Phase 3: Seeders & Business Logic
1. Implement `DatabaseSeeder.php` with:
   * Admin credentials: `admin@pbp.local` / `password`
   * Customer credentials: `customer@pbp.local` / `password`
   * 4 Categories (Electronics, Books, Apparel, Home & Living)
   * 20 Products with valid dummy images and stock > 5.

### Phase 4: Controllers & Inertia Endpoints
1. `ProductController`: Handles search, category filtering, and product detail.
2. `CartController`: Handles database cart persistence with quantity increment/decrement.
3. `CheckoutController`: Executes the atomic checkout logic:
   ```php
   DB::transaction(function () use ($request, $user) {
       // Validate stock -> Decrement stock -> Create order -> Create items -> Clear cart
   });
   ```
4. `Admin\DashboardController` & `Admin\ProductController`: Admin CRUD controls with role-guarding middleware.

### Phase 5: React Frontend Components
1. Layout: `AuthenticatedLayout.jsx`, `GuestLayout.jsx`, and `Navbar.jsx` with real-time cart badge counter.
2. Pages:
   * `Pages/Home.jsx`: Banner, featured categories, product grid with instant search.
   * `Pages/Products/Show.jsx`: Product gallery, stock indicator, quantity picker, Add to Cart.
   * `Pages/Cart/Index.jsx`: Cart table, subtotal summary, proceed to checkout.
   * `Pages/Checkout/Index.jsx`: Shipping form, mock payment selection, complete order button.
   * `Pages/Orders/Show.jsx`: Order receipt, items snapshot, payment status badge.
   * `Pages/Admin/Dashboard.jsx`: Inventory controls, orders list, status switcher.

---

## 9. Architecture Evolution & Implementation Status

As the project advanced into production implementation, several design choices were evolved to improve developer velocity, reliability, and modern stack alignment:

1. **Frontend Hosting Architecture**:
   - Replaced Inertia protocol with a Blade hydration host (`resources/views/app.blade.php`) mounting a **React 19 SPA** (`resources/js/app.jsx`) bundled via **Vite 8** and **Tailwind CSS v4** (`@tailwindcss/vite`).
2. **API & Authentication Layer**:
   - Adopted **Laravel Sanctum** (`laravel/sanctum` v4.x) personal access tokens for stateless bearer token API authentication.
3. **Multi-Vendor Ecosystem**:
   - Implemented multi-vendor architecture: `vendors`, `products.vendor_id`, and `order_items.vendor_id` with item-level vendor fulfillment and dedicated seller dashboard (`VendorDashboard.jsx`).
4. **Interactive PC Builder & Bulk Cart**:
   - Integrated full custom PC assembly tool (`PCBuilderSimulation.jsx`) with live wattage calculation, socket compatibility validation, and atomic bulk cart synchronization (`POST /api/cart/bulk`).
5. **Automated Testing Velocity**:
   - Achieved 100% automated test coverage with **PHPUnit 12** across 14 test suites (80 tests, 424 assertions) testing authentication, products, cart, wishlist, unified checkout, and vendor operations.