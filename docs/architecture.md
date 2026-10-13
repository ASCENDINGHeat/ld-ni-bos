# System Architecture

This document describes the architectural design, component layers, and request lifecycles of the **LD-NI-BOS** application.

---

## 1. High-Level Architecture

The application adopts a **Hybrid Single Page & API Architecture** where:
1. **Laravel 12 / 13 Core** acts as the primary application foundation, handling HTTP routing, session management, CSRF validation, database persistence, and API endpoints.
2. **API & Security Layer (Sanctum)** provides stateless bearer token authentication, request validation through Form Requests, rate limiting, and standard JSON resource serialization.
3. **Blade Hosting Layer** provides lightweight HTML host pages (`app.blade.php`), injecting Vite scripts and React hydration containers.
4. **React 19 Client Layer** renders dynamic user interfaces inside `#root`, styled using **Tailwind CSS v4** engine.

```mermaid
graph TD
    Client[Browser / Client Device] -->|HTTP GET /| WebServer[Laravel Web Server]
    Client -->|HTTP POST /api/login| ApiRouter[routes/api.php]
    
    subgraph Web Pipeline
        WebServer --> Kernel[HTTP Kernel / bootstrap/app.php]
        Kernel --> WebRouter[routes/web.php]
        WebRouter --> Blade[resources/views/app.blade.php]
        Blade -->|Vite Asset Ingestion| Assets[Vite Manifest / Dev Server]
        Assets --> ReactApp[resources/js/app.jsx]
        ReactApp --> DOM[React 19 Virtual DOM -> #root]
    end

    subgraph API Pipeline
        ApiRouter --> Throttle[Rate Limiter / Throttle]
        Throttle --> AuthGuard[Sanctum Auth Guard / Bearer Token]
        AuthGuard --> Controller[Api\AuthController]
        Controller --> Requests[Form Requests Validation]
        Controller --> Resource[UserResource Transformation]
        Resource --> JsonResponse[JSON Response 200/201]
    end

    Kernel -->|Eloquent Queries| Database[(SQLite Database)]
    Controller -->|Eloquent Queries| Database
```

---

## 2. Directory Structure & Responsibilities

```
ld-ni-bos/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php          # Customer & vendor authentication
│   │   │   │   ├── CartController.php          # Cart items & calculations
│   │   │   │   ├── CategoryController.php      # Component categories
│   │   │   │   ├── CheckoutController.php      # Unified checkout pipeline
│   │   │   │   ├── OrderController.php         # Customer orders & cancellations
│   │   │   │   ├── ProductController.php       # Product catalog & filters
│   │   │   │   ├── VendorController.php        # Vendor store profiles
│   │   │   │   ├── VendorOrderController.php   # Vendor orders & item fulfillment
│   │   │   │   ├── VendorProductController.php # Vendor product management
│   │   │   │   └── WishlistController.php      # Customer wishlists
│   │   │   └── Controller.php                  # Base controller
│   │   ├── Requests/
│   │   │   ├── Auth/                           # Registration & login requests
│   │   │   ├── Cart/                           # Cart addition & mutation requests
│   │   │   ├── Checkout/                       # Direct itemized order requests
│   │   │   ├── Order/                          # Cart checkout requests
│   │   │   └── Vendor/                         # Vendor store & product requests
│   │   └── Resources/
│   │       ├── CartItemResource.php            # Cart line items
│   │       ├── CategoryResource.php            # Category details
│   │       ├── OrderItemResource.php           # Order items with vendor attribution
│   │       ├── OrderResource.php               # Customer & vendor order entities
│   │       ├── ProductResource.php             # Products with specifications
│   │       ├── UserResource.php                # User profiles
│   │       ├── VendorResource.php              # Vendor store profiles
│   │       └── WishlistResource.php            # Wishlist entries
│   ├── Models/
│   │   ├── CartItem.php                        # Cart item model
│   │   ├── Category.php                        # Category model
│   │   ├── Order.php                           # Order model with auto-sync
│   │   ├── OrderItem.php                       # Order item model with auto-attribution
│   │   ├── Product.php                         # Product model with catalog scopes
│   │   ├── User.php                            # User model with role helpers
│   │   ├── Vendor.php                          # Vendor store model
│   │   └── Wishlist.php                        # Wishlist model
│   └── Providers/
│       └── AppServiceProvider.php              # Application service provider
├── bootstrap/
│   └── app.php                                 # Application configuration & middleware
├── database/
│   ├── factories/                              # Model factories
│   ├── migrations/                             # Database schema migrations
│   └── seeders/                                # Database seeders (ProductSeeder)
├── docs/                                       # Technical architecture documentation
├── resources/
│   ├── css/app.css                             # Tailwind CSS v4 root stylesheet
│   ├── js/
│   │   ├── app.jsx                             # React mounting shell & router
│   │   ├── components/                         # Storefront, checkout & vendor UI
│   │   └── services/api.js                     # Unified frontend API client
│   └── views/app.blade.php                     # Blade host template
├── routes/
│   ├── api.php                                 # REST API endpoints (Sanctum)
│   ├── web.php                                 # Storefront & vendor view routes
│   └── console.php                             # Console commands
├── tests/
│   └── Feature/                                # Feature tests (Auth, Cart, Orders, Vendors, Products)
├── docker/
│   ├── nginx.conf                              # Nginx server template with dynamic $PORT
│   ├── supervisord.conf                        # Supervisord process manager (php-fpm + nginx)
│   ├── php.ini                                 # Production OPcache & memory tuning
│   └── entrypoint.sh                           # Startup script (migrations, caches, port binding)
├── .github/
│   └── workflows/
│       └── docker-package.yml                  # GitHub Actions workflow for GHCR packaging
├── Dockerfile                                  # Multi-stage production container definition
├── docker-compose.yml                          # Local Docker Compose environment (PostgreSQL parity)
├── render.yaml                                 # Render Blueprint infrastructure specification
├── artisan                                     # Artisan CLI executable
├── composer.json                               # Backend dependencies
├── package.json                                # Frontend dependencies
└── vite.config.js                              # Vite bundler configuration
```

---

## 3. Request Lifecycles

### 3.1 Web Request Lifecycle
1. **Entrypoint (`public/index.php`)**: Bootstraps the application via `bootstrap/app.php`.
2. **Web Routing (`routes/web.php`)**: `Route::view('/', 'app')` renders `resources/views/app.blade.php`.
3. **Vite Bridge**: Injects `@viteReactRefresh` and `@vite(['resources/css/app.css', 'resources/js/app.jsx'])`.
4. **React Hydration**: `resources/js/app.jsx` initializes `createRoot(container).render(<App />)`.

### 3.2 API Request Lifecycle (Sanctum)
1. **API Routing (`routes/api.php`)**: Requests targeting `/api/*` are captured by the API pipeline configured in `bootstrap/app.php`.
2. **Rate Limiting**: Public auth endpoints enforce limits (`throttle:10,1` for register, `throttle:6,1` for login) preventing brute-force attacks.
3. **Form Request Validation**: Incoming requests are validated via dedicated Form Request classes (`RegisterRequest`, `LoginRequest`). Invalid data triggers an immediate `422 Unprocessable Entity` JSON response.
4. **Authentication & Token Issuance**: On valid login, `AuthController` issues a hashed personal access token via `$user->createToken()`.
5. **Token Verification**: Protected routes use `auth:sanctum` middleware, verifying the Bearer token in the `Authorization` header against `personal_access_tokens`.
6. **Resource Serialization**: Responses are formatted through Eloquent API Resources (`UserResource`) to ensure clean JSON structures.

---

## 4. Database & Storage Architecture

- **Development Database**: SQLite (`DB_CONNECTION=sqlite`, `database/database.sqlite`) running zero-config out of the box with foreign keys enabled (`DB_FOREIGN_KEYS=true`).
- **Production Database**: Managed PostgreSQL (`DB_CONNECTION=pgsql`) with automated `DATABASE_URL` discovery. Compatible with Render managed PostgreSQL and external PostgreSQL/MySQL instances.
- **Personal Access Tokens**: Stored in `personal_access_tokens` table via Laravel Sanctum.
- **Sessions**: Stored in database table `sessions` (`SESSION_DRIVER=database`).
- **Queues**: Stored in database table `jobs` (`QUEUE_CONNECTION=database`).
- **Cache**: Stored in database table `cache` (`CACHE_STORE=database`).

---

## 5. Container & Cloud Deployment Architecture

The application is fully containerized using a multi-stage Docker setup optimized for cloud hosting (Render) and self-hosting:

```mermaid
graph LR
    subgraph Build Phase
        NodeStage[Stage 1: node:20-alpine] -->|npm run build| BuiltAssets[public/build Assets]
    end

    subgraph Runtime Phase
        BuiltAssets --> PHPStage[Stage 2: php:8.3-fpm-alpine]
        PHPStage --> Nginx[Nginx Web Server]
        PHPStage --> FPM[PHP 8.3-FPM]
        PHPStage --> Supervisor[Supervisord Process Manager]
    end

    Cloud[Render Edge / Reverse Proxy] -->|Port $PORT| Nginx
    Nginx -->|FastCGI 127.0.0.1:9000| FPM
    FPM -->|Pessimistic Queries| PostgreSQL[(Managed PostgreSQL)]
```

### Key Deployment Characteristics
1. **Multi-Stage Separation**: Frontend Vite assets (React 19, Tailwind CSS v4) are compiled in a Node 20 builder stage and copied to Nginx web root. The production image runs strictly on Alpine Linux with PHP 8.3-FPM, eliminating Node runtime overhead (~130MB total image size).
2. **Dynamic Port Binding**: Supports Render's dynamic `$PORT` environment variable (default `10000`) via `/usr/local/bin/entrypoint.sh` template substitution.
3. **SSL Reverse Proxy Trust**: Configured with `$middleware->trustProxies(at: '*')` and `URL::forceScheme('https')` in production to accurately handle Cloudflare/Render SSL termination headers.
4. **Automated Bootstrapping**: The container startup script automatically handles storage symlinks, configuration and route caching, and runs `php artisan migrate --force` against the connected database.
5. **Continuous Packaging**: GitHub Actions workflow (`.github/workflows/docker-package.yml`) automatically builds and publishes OCI-compliant container images to GitHub Container Registry (`ghcr.io`).
