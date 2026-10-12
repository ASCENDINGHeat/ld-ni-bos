# Frontend Architecture & Guide

This guide details the frontend architecture, React 19 component hierarchy, Tailwind CSS v4 styling, and Vite bundling for **LD-NI-BOS**.

---

## 1. Frontend Technology Stack

- **Framework**: [React 19](https://react.dev/) (`^19.3.0`)
- **CSS Engine**: [Tailwind CSS v4](https://tailwindcss.com/) (`^4.0.0`) via `@tailwindcss/vite`
- **Asset Bundler**: [Vite 8](https://vitejs.dev/) (`^8.0.0`) with `laravel-vite-plugin` (`^3.1`)
- **Typography**: [Instrument Sans](https://fonts.bunny.net/family/instrument-sans) loaded via Bunny Fonts
- **State Management**: React state hooks (`useState`, `useEffect`) and persistent `localStorage` for authentication tokens
- **API Client**: Modular asynchronous Fetch wrapper with Sanctum Bearer token injection (`resources/js/services/api.js`)

---

## 2. Blade Host Template (`resources/views/app.blade.php`)

The application serves a Blade template as the mounting shell for React, injecting initial view context via dataset attributes:

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'LD-NI-BOS') }}</title>

    <!-- React Fast Refresh Directive MUST precede vite scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
    <div
        id="root"
        data-initial-view="{{ $initialView ?? 'beranda' }}"
        data-vendor-section="{{ $vendorSection ?? 'overview' }}"
        data-product-slug="{{ $productSlug ?? '' }}"
    ></div>
</body>
</html>
```

The Blade controller / route injects:
- `data-initial-view`: `'beranda'`, `'katalog'`, `'pc-builder'`, `'cart'`, `'checkout'`, `'account'`, `'detail'`, `'vendor-dashboard'`
- `data-vendor-section`: `'overview'`, `'products'`, `'orders'`, `'reports'`, `'settings'`
- `data-product-slug`: Slug of the product for direct detail page rendering (`/produk/{slug}`)

---

## 3. Application Shell & Client-Side Routing (`resources/js/app.jsx`)

The React application entry point initializes the DOM root inside `#root` and coordinates views and global state:

```
App State
├── activeView ('beranda' | 'katalog' | 'pc-builder' | 'cart' | 'checkout' | 'account' | 'vendor-dashboard' | 'detail')
├── currentUser & accessToken (synced via localStorage)
├── cartItems (synced with /api/cart)
├── wishlistItems (synced with /api/wishlist)
└── activeModals (AuthModal, WishlistModal, CartDrawer, QuickViewModal, SuccessModal)
```

### URL Sync & History Management
`app.jsx` synchronizes navigation with browser history using `window.history.pushState`:
- `/` -> `beranda`
- `/katalog` -> `katalog`
- `/pc-builder` -> `pc-builder`
- `/keranjang` -> `cart`
- `/checkout` -> `checkout`
- `/akun` -> `account`
- `/produk/{slug}` -> `detail`
- `/vendor/dashboard`, `/vendor/products`, `/vendor/orders`, `/vendor/reports`, `/vendor/settings` -> `vendor-dashboard`

---

## 4. Component Hierarchy & Modules

All client-side components reside under `resources/js/components/`:

### 4.1 Storefront & Navigation
- **`Layout.jsx`**: Master wrapper providing top header banner, sticky navbar, main view container, and footer.
- **`Navbar.jsx`**: Primary navigation bar with search bar, catalog category dropdowns, cart badge with item counter, wishlist counter, dark/light theme switch, and user profile / login actions.
- **`Footer.jsx`**: Platform branding, payment method badges, customer service contacts, and navigation links.
- **`ThemeToggle.jsx`**: Dark mode toggle persisting preference to `localStorage` and toggling `dark` class on `document.documentElement`.

### 4.2 Product Catalog & Detail
- **`ProductCatalog.jsx`**: Complete catalog browse view with category filtering, search term matching, sort orders (price ascending/descending, popularity), and stock availability filters.
- **`ProductCard.jsx`**: Individual product tile displaying product image, brand, title, specs summary, formatted price in Rupiah (`Rp`), in-stock indicator, quick-add-to-cart button, and wishlist toggle button.
- **`ProductFilterSidebar.jsx`**: Filter sidebar with price slider, category checkboxes, brand filters, and reset action.
- **`ProductQuickViewModal.jsx`**: Lightweight preview modal showing product image gallery, full specifications table, quantity selector, and direct "Beli Sekarang" / "Tambah ke Keranjang" buttons.
- **`ProductDetailPage.jsx`**: Dedicated full-page product showcase with breadcrumbs, thumbnail gallery, technical specifications breakdown, vendor store card, related products carousel, and customer reviews.

### 4.3 Interactive PC Builder Simulation
- **`PCBuilderSimulation.jsx`**: Interactive custom PC configurator. Allows users to select compatible components across slots:
  - Processor (CPU)
  - Motherboard
  - Kartu Grafis (GPU)
  - Memory (RAM)
  - Penyimpanan (SSD / HDD)
  - Power Supply (PSU)
  - Casing Komputer
- **`ComponentSlot.jsx`**: Displays selected hardware component, price, wattage, and action buttons ("Pilih Komponen", "Ganti", "Hapus").
- **`ComponentPickerModal.jsx`**: Component selection modal with category filtering and real-time socket/spec compatibility checks.
- Features: Real-time estimated wattage calculator, total build cost aggregator, and one-click "Tambah Rakitan ke Keranjang" bulk cart synchronization.

### 4.4 Shopping Cart & Wishlist
- **`CartPage.jsx`**: Full-page cart interface with line item quantity increment/decrement, bulk selection, subtotal calculation, free shipping threshold indicator, and proceed-to-checkout CTA.
- **`CartDrawer.jsx`**: Slide-over quick cart drawer accessible from any page.
- **`WishlistModal.jsx`**: Modal listing bookmarked products with quick-move-to-cart capability.

### 4.5 Checkout & Order Fulfillment
- **`CheckoutPage.jsx`**: Multi-step checkout form:
  - Recipient information (Full name, phone, full shipping address, notes)
  - Shipping method selector (`regular`: Rp 20.000 / Free for orders >= Rp 2.000.000; `express`: Rp 35.000)
  - Payment method selector (`bank-transfer`, `e-wallet`, `cod`)
  - Itemized order review with vendor line items
  - API dispatch to `POST /api/checkout`
- **`TransactionSuccessModal.jsx`**: Post-checkout modal presenting simulated virtual account / transfer details, order ID, and "Lihat Pesanan Saya" action.

### 4.6 Account Management & Authentication
- **`AccountSettingsPage.jsx`**: User profile overview, shipping address management, and recent order history with live status badges.
- **`AuthModal.jsx`**: Dual-tab authentication dialog supporting login and registration with validation feedback.

### 4.7 Vendor Portal (`VendorDashboard.jsx`)
Dedicated vendor management interface for sellers:
- **Overview**: Gross sales revenue, total products sold, active products count, and new pending order badges.
- **Products**: Vendor product catalog table with live stock status, edit product modal, and new product creation.
- **Orders**: Multi-vendor order fulfillment dashboard with status action triggers (`processing`, `shipped`, `completed`, `cancelled`).
- **Reports**: Sales volume graphs and component category demand analytics.
- **Settings**: Store profile details (store name, slug, phone, description, logo).

---

## 5. Frontend API Service (`resources/js/services/api.js`)

Centralized asynchronous client connecting React components to the Laravel backend:

```javascript
// Authentication
loginApi(credentials)
registerApi(userData)
logoutApi()
fetchUserProfile()

// Products & Catalog
getProducts(params)
getProductDetail(slug)
getCategories()

// Shopping Cart
getCart()
addToCartApi(productId, quantity)
bulkAddToCartApi(items)
updateCartItemApi(cartItemId, quantity)
removeCartItemApi(cartItemId)
clearCartApi()

// Wishlist
getWishlist()
toggleWishlistApi(productId)

// Orders & Checkout
createOrder(orderPayload)
fetchCustomerOrders()
cancelCustomerOrder(orderId)

// Vendor Portal
fetchVendorStore()
createVendorStore(payload)
updateVendorStore(payload)
fetchVendorProducts(params)
createVendorProduct(payload)
updateVendorProduct(productId, payload)
deleteVendorProduct(productId)
fetchVendorDashboard()
fetchVendorOrders()
updateVendorOrderStatus(orderId, status)
```

---

## 6. Tailwind CSS v4 Styling Configuration (`resources/css/app.css`)

```css
@import 'tailwindcss';

@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';
@source '../views/**/*.blade.php';
@source '../js/**/*.{jsx,js}';

@theme {
    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}
```

Tailwind v4 scans all `.jsx` files in `resources/js/` and compiles utilities without needing a traditional `tailwind.config.js`.

---

## 7. Build & Development Commands

```bash
# Start Vite development server with HMR:
npm run dev

# Compile production bundle to public/build:
npm run build
```
