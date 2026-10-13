# Gap Analysis, Unimplemented Features & Progress Tracker

**Document Version:** 1.0  
**Project:** LD-NI-BOS (Platform Commerce PC Store)  
**Last Updated:** October 2026  
**Audience:** Development Team, Product Owner, AI Coding Agents  

---

## 1. Executive Summary & Audit Overview

This document provides an exhaustive **Gap Analysis**, **Unimplemented Features Catalog**, and **Progress Tracker** for the **LD-NI-BOS** platform commerce application.

The evaluation benchmarks the current codebase implementation against three foundational requirement baselines:
1. **[PRD & SRS Specification.md](PRD%20&%20SRS%20Specification.md)** — Core product requirements, persona capabilities, and functional requirements.
2. **[design-guideline-pc-store.md](../design-guideline-pc-store.md)** — Front-end UI/UX behaviors, component inventory, theme system, and responsive requirements.
3. **[architecture.md](architecture.md) & [backend.md](backend.md)** — System architecture, database integrity, and REST API conventions.

### Current Implementation Scorecard

| Domain / Subsystem | Completion | Status | Test Coverage |
|---|:---:|:---:|:---:|
| **Authentication & Authorization** | 90% | 🟢 Stable | 100% (2 Feature Suites) |
| **Product Catalog & Category Discovery** | 95% | 🟢 Stable | 100% (2 Feature Suites) |
| **Shopping Cart & Wishlist** | 95% | 🟢 Stable | 100% (2 Feature Suites) |
| **Interactive PC Builder Simulation** | 85% | 🟢 Functional | 100% (Cart Integration Tested) |
| **Unified Checkout & Order Fulfillment** | 90% | 🟢 Stable | 100% (2 Feature Suites) |
| **Multi-Vendor Store Management** | 85% | 🟢 Functional | 100% (3 Feature Suites) |
| **User Profile & Account Settings** | 40% | 🟡 Partially Implemented | 0% (UI Prototype Only) |
| **Platform Administration (Super Admin)** | 10% | 🔴 Backlog / Unimplemented | 0% (Role seeded only) |
| **Product Reviews & Ratings** | 0% | 🔴 Backlog / Unimplemented | 0% (Not Started) |
| **Media & Direct File Uploads** | 20% | 🟡 URL-based only | N/A |
| **DevOps & Containerization** | 100% | 🟢 Complete | Multi-Stage Docker, GHCR CI, Render Blueprint |
| **Overall Platform Progress** | **82%** | 🟢 **Core MVP & Deployment Ready** | **80 Tests / 424 Assertions Passing** |

---

## 2. Comprehensive Gap Analysis Matrix

The table below contrasts expected specifications against the actual codebase implementation:

| Module / Feature | Specification Baseline | Codebase Implementation Status | Gap Description & Severity |
|---|---|---|---|
| **User Registration & Login** | PRD FR-AUTH-01..03, Sanctum Bearer tokens, rate limiting. | Fully implemented via [`AuthController.php`](../app/Http/Controllers/Api/AuthController.php), [`RegisterRequest.php`](../app/Http/Requests/Auth/RegisterRequest.php), [`LoginRequest.php`](../app/Http/Requests/Auth/LoginRequest.php). | 🟢 **None**. Matches requirements and passing all tests. |
| **User Roles** | Customer, Vendor, Admin roles supported. | Implemented via `users.role` enum/string column (`'customer'`, `'vendor'`, `'admin'`) and helper methods `isCustomer()`, `isVendor()`, `isAdmin()`. | 🟢 **None**. Underlying data model supports all 3 roles. |
| **Profile & Settings Mutation** | PRD FR-AUTH & Design Guideline §11.1 (Edit profile, change password, manage delivery addresses). | UI exists in [`AccountSettingsPage.jsx`](../resources/js/components/AccountSettingsPage.jsx), but form submission shows: *"Belum tersimpan: endpoint penyimpanan pengaturan belum tersedia."* | 🟡 **Medium Gap**. No `PATCH /api/user`, `PUT /api/user/password`, or multi-address table exists in backend. |
| **Product Catalog & Search** | PRD FR-PROD-01..04 (Pagination, category filters, text search, price sort, stock indicator). | Fully implemented via [`ProductController.php`](../app/Http/Controllers/Api/ProductController.php), [`ProductResource.php`](../app/Http/Resources/ProductResource.php), [`ProductCatalog.jsx`](../resources/js/components/ProductCatalog.jsx). | 🟢 **None**. Supports search, brand, category, type, price filters, and pagination. |
| **Hardware Specifications** | Design Guideline §5, §11.2 (Structured sockets, TDP, memory types, warranty). | Implemented via JSON column `products.specifications` and normalized in [`api.js`](../resources/js/services/api.js). | 🟢 **None**. Displayed cleanly across detail views and quick-view modals. |
| **Shopping Cart Persistence** | PRD FR-CART-01..04 (Persistent cart in DB, quantity limits, stock check, grand total). | Implemented via [`CartController.php`](../app/Http/Controllers/Api/CartController.php), [`CartItem.php`](../app/Models/CartItem.php), [`CartPage.jsx`](../resources/js/components/CartPage.jsx). | 🟢 **None**. Calculates subtotals and auto-formats currency. |
| **Bulk Cart Addition (PC Builder)** | Design Guideline §11.3 (Add complete PC configuration to cart in one action). | Implemented via `POST /api/cart/bulk` with `resolveProduct()` mock alias resolution in [`CartController.php`](../app/Http/Controllers/Api/CartController.php). | 🟢 **None**. Fully tested in [`CartTest.php`](../tests/Feature/CartTest.php). |
| **Guest Shopping Cart** | Design Guideline §11.4 (Guest can accumulate items before logging in). | Unauthenticated users opening cart or clicking "Tambah ke Keranjang" are prompted to log in via [`AuthModal.jsx`](../resources/js/components/AuthModal.jsx). | 🔵 **Low Gap**. LocalStorage guest cart staging with auto-merge on login is not yet implemented. |
| **PC Builder Compatibility Checks** | Design Guideline §11.3 (Real-time compatibility warnings with explanation). | Implemented client-side in [`PCBuilderSimulation.jsx`](../resources/js/components/PCBuilderSimulation.jsx) (CPU socket vs Motherboard socket, RAM type vs Motherboard, estimated PSU wattage). | 🟡 **Low Gap**. No server-side validation endpoint (`POST /api/pc-builder/validate`) or saved builds table (`saved_builds`). |
| **Wishlist Management** | Design Guideline §9, §11.4 (Bookmark products, header counter, toggle on cards & details). | Fully implemented via [`WishlistController.php`](../app/Http/Controllers/Api/WishlistController.php), [`Wishlist.php`](../app/Models/Wishlist.php), [`WishlistModal.jsx`](../resources/js/components/WishlistModal.jsx). | 🟢 **None**. Full CRUD with toggle action and tests. |
| **Unified Checkout Flow** | PRD FR-CHCK-01..04 (Address validation, mock payments, inventory decrement, order snapshot). | Implemented via [`CheckoutController.php`](../app/Http/Controllers/Api/CheckoutController.php) and [`OrderController.php`](../app/Http/Controllers/Api/OrderController.php). Pessimistic locking `lockForUpdate()`. | 🟢 **None**. Handles both direct itemized lists and persistent cart checkout. |
| **Order Cancellation & Stock Return** | Design Guideline §11.5, §19 (Cancel pending/paid order, restore inventory). | Fully implemented via `PATCH /api/orders/{id}/cancel` in [`OrderController.php`](../app/Http/Controllers/Api/OrderController.php). | 🟢 **None**. Restores product inventory inside atomic database transaction. |
| **Multi-Vendor Store Registry** | Design Guideline §11.6 (Store profile, unique slug, seller contact info). | Implemented via [`VendorController.php`](../app/Http/Controllers/Api/VendorController.php), [`Vendor.php`](../app/Models/Vendor.php). | 🟢 **None**. Supports `show`, `store`, `update`, unique slugs, and user constraint. |
| **Vendor Product Catalog Management** | Design Guideline §11.6 (CRUD products owned by vendor, stock, price, specs). | Implemented via [`VendorProductController.php`](../app/Http/Controllers/Api/VendorProductController.php), [`VendorProductControllerTest.php`](../tests/Feature/Api/VendorProductControllerTest.php). | 🟢 **None**. Full ownership isolation and tests. |
| **Vendor Order Fulfillment** | Design Guideline §11.6 (View orders containing vendor items, change item status). | Implemented via [`VendorOrderController.php`](../app/Http/Controllers/Api/VendorOrderController.php), item-level status updates (`processing`, `shipped`, `completed`, `cancelled`). | 🟢 **None**. Automatically handles item-level stock returns if vendor cancels. |
| **Vendor Public Storefront** | Design Guideline §11.6, §12 (Public view displaying store profile and vendor-only products). | Products show vendor name/store in detail page, but there is no dedicated `/toko/{slug}` or `/vendor/{slug}` public storefront page. | 🟡 **Medium Gap**. No dedicated public vendor catalog view. |
| **Platform Administration (Super Admin)** | PRD FR-ADM-01..03, Routes §6.2 (Global sales dashboard, category CRUD, all orders moderation). | `admin@example.com` seeded in [`DatabaseSeeder.php`](../database/seeders/DatabaseSeeder.php), but no admin controllers, admin middleware, or admin frontend views exist. | 🔴 **High Gap**. Super-admin operations are entirely unbuilt. |
| **Product Customer Reviews** | PRD persona capabilities & common e-commerce standard. | No `reviews` table, no review submission API, no ratings aggregator. | 🔴 **Medium Gap**. Reviews and star ratings are not implemented. |
| **Media File Uploads** | Product & vendor images stored on disk. | Product and store images currently accept external image URLs / Unsplash links. No file storage upload pipeline (`Storage::disk('public')`). | 🟡 **Medium Gap**. No `POST /api/upload` or image upload field in vendor forms. |

---

## 3. Detailed Unimplemented Features Catalog

This section details all missing or incomplete features, including architectural requirements and implementation plans.

### 3.1 Feature GAP-01: User Profile & Account Settings Persistence
- **Priority:** High
- **Domain:** Customer & Vendor Account Management
- **Current State:** [`AccountSettingsPage.jsx`](../resources/js/components/AccountSettingsPage.jsx) has forms for editing profile info, shipping address, and password, but all submit handlers show demo notices because the backend endpoints do not exist.
- **Required Backend Changes:**
  - Create Form Requests: `UpdateProfileRequest` (name, phone, address) and `UpdatePasswordRequest` (current_password, password, password_confirmation).
  - Add methods to [`AuthController.php`](../app/Http/Controllers/Api/AuthController.php):
    - `updateProfile(UpdateProfileRequest $request): UserResource`
    - `updatePassword(UpdatePasswordRequest $request): JsonResponse`
  - Register routes in [`routes/api.php`](../routes/api.php):
    - `PATCH /api/user` -> `AuthController@updateProfile`
    - `PUT /api/user/password` -> `AuthController@updatePassword`
- **Required Frontend Changes:**
  - Connect `AccountSettingsPage.jsx` form submissions to `PATCH /api/user` and `PUT /api/user/password` via [`api.js`](../resources/js/services/api.js).
  - Update current user in `localStorage` upon successful profile save.
- **Test Scenarios:**
  - Customer can update name, phone, and address.
  - Customer cannot update password without valid current password.
  - Profile validation rejects malformed phone numbers or duplicate emails.

---

### 3.2 Feature GAP-02: Platform Admin Management Subsystem
- **Priority:** High
- **Domain:** Platform Administration & Operations
- **Current State:** Super admin role (`role: 'admin'`) exists on `users` table and is seeded (`admin@example.com`), but no admin routes, controllers, or UI exist.
- **Required Backend Changes:**
  - Create middleware `app/Http/Middleware/EnsureUserIsAdmin.php` guarding against non-admin requests (`403 Forbidden`).
  - Create Admin Controllers under `app/Http/Controllers/Api/Admin/`:
    - `AdminDashboardController.php`: System-wide metrics (total revenue, total orders count, total vendors count, low stock alerts).
    - `AdminCategoryController.php`: Category CRUD (`index`, `store`, `update`, `destroy`) with unique slug generation.
    - `AdminOrderController.php`: View all orders platform-wide, filter by vendor or status, override order status.
    - `AdminUserController.php`: View and moderate customer and vendor accounts.
  - Register routes in [`routes/api.php`](../routes/api.php) under `Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])`.
- **Required Frontend Changes:**
  - Create `AdminDashboard.jsx` accessible when authenticated user has `user.role === 'admin'`.
  - Sections: Platform Overview, Category Manager, User Directory, Order Overseer.
- **Test Scenarios:**
  - Only authenticated admin users can access `/api/admin/*`.
  - Customer and Vendor accounts receive `403 Forbidden`.
  - Admin can create, rename, and delete component categories.

---

### 3.3 Feature GAP-03: Product Reviews & Rating Subsystem
- **Priority:** Medium
- **Domain:** Social Proof & Customer Feedback
- **Current State:** Products have descriptions and specs, but no reviews, star ratings, or verified buyer feedback.
- **Required Backend Changes:**
  - Migration `create_product_reviews_table`:
    - Columns: `id`, `user_id` (FK), `product_id` (FK), `order_id` (FK, nullable), `rating` (integer 1–5), `title` (string, nullable), `comment` (text), `is_verified_buyer` (boolean, default false), `created_at`, `updated_at`.
  - Model [`Product.php`](../app/Models/Product.php) with relation: `reviews(): HasMany`, computed attributes: `average_rating`, `reviews_count`.
  - Controller `Api/ReviewController.php`:
    - `GET /api/products/{slug}/reviews`: Paginated reviews list.
    - `POST /api/products/{slug}/reviews`: Submit review (must be authenticated). Auto-check if user has purchased the item in a `completed` or `paid` order for `is_verified_buyer`.
- **Required Frontend Changes:**
  - Add rating summary (average score, star distribution) and review form to [`ProductDetailPage.jsx`](../resources/js/components/ProductDetailPage.jsx).
  - Add rating stars to [`ProductCard.jsx`](../resources/js/components/ProductCard.jsx).
- **Test Scenarios:**
  - Customer can submit review with rating 1 to 5.
  - Reviews automatically flag verified buyer if matched against past orders.
  - Validation rejects ratings outside 1–5 range.

---

### 3.4 Feature GAP-04: Saved PC Configurations & Shareable Build URLs
- **Priority:** Medium
- **Domain:** PC Builder Simulation
- **Current State:** Users can assemble a PC in [`PCBuilderSimulation.jsx`](../resources/js/components/PCBuilderSimulation.jsx) and add it to the cart in bulk. However, they cannot save the build to their account or generate a shareable link.
- **Required Backend Changes:**
  - Migration `create_saved_builds_table`:
    - Columns: `id`, `uuid` (unique string for public sharing), `user_id` (FK, nullable), `title` (string), `description` (text, nullable), `configuration` (JSON column storing slot selections), `estimated_wattage` (integer), `total_price` (decimal), `is_public` (boolean, default true), `created_at`, `updated_at`.
  - Controller `Api/SavedBuildController.php`:
    - `POST /api/pc-builder/builds`: Save configuration.
    - `GET /api/pc-builder/builds/{uuid}`: Load shared configuration for any visitor.
    - `GET /api/pc-builder/my-builds`: List user's saved builds (`auth:sanctum`).
- **Required Frontend Changes:**
  - Add "Simpan Rakitan" and "Bagikan Rakitan" (Copy link) buttons to [`PCBuilderSimulation.jsx`](../resources/js/components/PCBuilderSimulation.jsx).
  - Add support for URL query parameter `/pc-builder?build=<uuid>` to automatically load a shared build configuration.
- **Test Scenarios:**
  - User can save build configuration and receive unique UUID.
  - Guest can load shared configuration via UUID.

---

### 3.5 Feature GAP-05: Dedicated Public Vendor Storefront Page
- **Priority:** Medium
- **Domain:** Multi-Vendor Discovery
- **Current State:** Vendor stores manage products and fulfillment from [`VendorDashboard.jsx`](../resources/js/components/VendorDashboard.jsx), and products display vendor names on detail pages. However, clicking a vendor name does not open a dedicated storefront page.
- **Required Backend Changes:**
  - Controller endpoint: `GET /api/vendors/{slug}` returning vendor profile, active products, and store statistics.
  - Filter parameter on `GET /api/products?vendor={vendor_slug}`.
- **Required Frontend Changes:**
  - Web route: `/toko/{slug}` in [`routes/web.php`](../routes/web.php).
  - Component `VendorStorePage.jsx` displaying store banner, store logo, location, description, and grid of products sold exclusively by this vendor.
  - Link vendor badges in [`ProductDetailPage.jsx`](../resources/js/components/ProductDetailPage.jsx) to the vendor's storefront.
- **Test Scenarios:**
  - Visiting `/toko/{slug}` renders public vendor details and filtered product catalog.
  - Inactive products belonging to the vendor are hidden from public view.

---

### 3.6 Feature GAP-06: Direct Media File Uploads
- **Priority:** Medium
- **Domain:** Media & Assets
- **Current State:** Product images and vendor store logos use direct external URLs (e.g. Unsplash or CDN links).
- **Required Backend Changes:**
  - Endpoint `POST /api/upload`: Accepts `multipart/form-data` with image validation (`image`, `mimes:jpeg,png,webp`, `max:2048`).
  - Stores files in `storage/app/public/uploads` and returns public asset URL (`/storage/uploads/...`).
  - Symlink initialized via `php artisan storage:link`.
- **Required Frontend Changes:**
  - Add image drag-and-drop / file selector in vendor product creation modal in [`VendorDashboard.jsx`](../resources/js/components/VendorDashboard.jsx).
- **Test Scenarios:**
  - Uploading valid image returns HTTP 201 with stored URL.
  - Non-image files are rejected with HTTP 422.

---

### 3.7 Feature GAP-07: Guest Cart LocalStorage Staging & Merge on Login
- **Priority:** Low
- **Domain:** Cart Usability
- **Current State:** When unauthenticated visitors click "Tambah ke Keranjang", they are prompted to log in immediately.
- **Desired State:** Unauthenticated visitors can add products to a local browser cart (`localStorage`). When they log in or register, the client dispatches items to `POST /api/cart/bulk`, seamlessly merging guest items into their persistent database cart.
- **Required Frontend Changes:**
  - Update `addToCart` logic in [`api.js`](../resources/js/services/api.js) to store items locally when `!getStoredToken()`.
  - On successful login in [`AuthModal.jsx`](../resources/js/components/AuthModal.jsx), check for local guest cart items and call `addMultipleToCart(localItems)`, then clear local storage.

---

## 4. Progress Tracker & Implementation Roadmap

```
Phase 1: Foundation & Auth           [████████████████████] 100% (Completed)
Phase 2: Product Catalog & Cart      [████████████████████] 100% (Completed)
Phase 3: PC Builder & Bulk Cart      [██████████████████░░]  90% (Active)
Phase 4: Multi-Vendor & Checkout     [██████████████████░░]  90% (Active)
Phase 5: Containerization & DevOps   [████████████████████] 100% (Completed)
Phase 6: User Settings & Profile     [████████░░░░░░░░░░░░]  40% (In Progress)
Phase 7: Public Vendor Storefront    [████░░░░░░░░░░░░░░░░]  20% (Planned)
Phase 8: Platform Admin Portal       [██░░░░░░░░░░░░░░░░░░]  10% (Backlog)
Phase 9: Reviews, Media & Social     [░░░░░░░░░░░░░░░░░░░░]   0% (Backlog)
```

### Milestone Breakdown

#### Milestone 1: Platform Foundation & Core Security 🟢 (COMPLETE)
- [x] Laravel 12 / Framework 13 setup on PHP 8.5 with SQLite file database.
- [x] Laravel Sanctum bearer token authentication system with rate-limited endpoints.
- [x] User registration, login, profile retrieval, and logout token revocation.
- [x] Customer and vendor role foundation in Eloquent.
- [x] React 19 mounting shell on Blade host template with Vite 8.
- [x] Tailwind CSS v4 `@theme` configuration with dark mode support.
- [x] PHPUnit 12 feature test suite for authentication.

#### Milestone 2: Storefront Catalog & Persistent Cart 🟢 (COMPLETE)
- [x] Hardware categories and product models with JSON specifications and scopes.
- [x] Category and product API endpoints with search, category filtering, type filtering, price sorting, and pagination.
- [x] High-resolution catalog seeders with realistic PC parts and pre-built rigs ([`ProductSeeder.php`](../database/seeders/ProductSeeder.php)).
- [x] Persistent database shopping cart ([`CartItem.php`](../app/Models/CartItem.php)) with automated subtotal calculation.
- [x] Full-page cart interface ([`CartPage.jsx`](../resources/js/components/CartPage.jsx)) and slide-over cart drawer ([`CartDrawer.jsx`](../resources/js/components/CartDrawer.jsx)).
- [x] Wishlist subsystem with toggle action, counter badge, and dedicated modal.

#### Milestone 3: Interactive PC Builder Simulation 🟢 (FUNCTIONAL)
- [x] 7-slot component configurator (CPU, Motherboard, GPU, RAM, Storage, PSU, Casing).
- [x] Component picker modal with socket and form factor filtering.
- [x] Real-time estimated system wattage calculator and cost aggregator.
- [x] Atomic bulk cart synchronization (`POST /api/cart/bulk`) supporting mock codes and product slugs.
- [ ] Server-side compatibility verification endpoint (`POST /api/pc-builder/validate`).
- [ ] Save custom build to user profile and generate shareable build links.

#### Milestone 4: Multi-Vendor Marketplace & Checkout Pipeline 🟢 (FUNCTIONAL)
- [x] Vendor store profile creation and management ([`VendorController.php`](../app/Http/Controllers/Api/VendorController.php)).
- [x] Vendor product inventory CRUD with ownership verification.
- [x] Vendor dashboard displaying sales metrics (gross sales, items sold, active inventory, new orders).
- [x] Item-level order fulfillment status tracking (`pending` -> `processing` -> `shipped` -> `completed` -> `cancelled`).
- [x] Unified checkout pipeline (`POST /api/checkout`) with pessimistic inventory locking (`lockForUpdate`).
- [x] Order cancellation (`PATCH /api/orders/{id}/cancel`) with automatic inventory restoration.
- [ ] Public vendor storefront page (`/toko/{slug}`).

#### Milestone 5: Containerization & Cloud Deployment Pipeline 🟢 (COMPLETE)
- [x] Multi-stage production Dockerfile (`node:20-alpine` Vite builder + `php:8.4-fpm-alpine` runtime).
- [x] Supervisord process manager orchestrating both PHP-FPM and Nginx in a unified container.
- [x] Dynamic port binding (`PORT` default `10000`) for Render web service compatibility.
- [x] Render Blueprint infrastructure-as-code specification (`render.yaml`) with auto-managed PostgreSQL.
- [x] Local Docker Compose environment with PostgreSQL database parity (`docker-compose.yml`).
- [x] GitHub Actions automated CI packaging workflow (`.github/workflows/docker-package.yml`) publishing to GHCR (`ghcr.io`).
- [x] Reverse proxy SSL trust (`trustProxies('*')`) and automated production HTTPS scheme enforcement.
- [x] Automated container startup entrypoint with migrations, storage symlinking, and config caching.

#### Milestone 6: Account Profile & Preferences 🟡 (IN PROGRESS)
- [x] Responsive account settings UI tab layout ([`AccountSettingsPage.jsx`](../resources/js/components/AccountSettingsPage.jsx)).
- [ ] Profile update endpoint (`PATCH /api/user`) for customer name, phone, and address.
- [ ] Password update endpoint (`PUT /api/user/password`) with current password verification.
- [ ] Multi-address management table and API.
- [ ] Vendor bank account / payout settings persistence.

#### Milestone 6: Platform Administration (Super Admin) 🔴 (NEXT PHASE)
- [ ] Admin route middleware (`admin`).
- [ ] Global sales analytics and order overseer dashboard.
- [ ] Category management CRUD (create, update, delete PC categories).
- [ ] User and vendor account moderation.

#### Milestone 7: Social Proof & Media Uploads 🔴 (BACKLOG)
- [ ] Product reviews and star ratings table, API, and UI.
- [ ] Verified buyer review badge based on past orders.
- [ ] Local file upload pipeline (`POST /api/upload`) for product images and store banners.
- [ ] Guest cart localStorage staging with auto-merge on customer login.

---

## 5. Technical Debt & Architecture Recommendations

1. **Database Concurrency & SQLite Considerations**:
   - The platform currently uses pessimistic locking (`lockForUpdate()`) inside database transactions during checkout and vendor status updates.
   - On SQLite, database-level locking serializes writes cleanly for development, demo, and low-concurrency environments.
   - For high-concurrency production deployments, migrating to PostgreSQL or MySQL is recommended to leverage granular row-level locking.
2. **Form Request Separation for User Settings**:
   - As `AuthController` expands, create dedicated `App\Http\Controllers\Api\UserProfileController` to keep authentication separate from profile maintenance.
3. **Automated End-to-End Test Suite Preservation**:
   - Maintain the current 100% pass rate across the existing 14 test suites (80 tests, 424 assertions) whenever implementing any of the backlog items above.
   - Run `php vendor/bin/phpunit` and `php vendor/bin/pint --dirty --format agent` after each feature addition.
