# LD-NI-BOS

<p align="center">
  <strong>PBP Platform Commerce — Modern Full-Stack E-Commerce Platform</strong><br>
  Built with <strong>Laravel 12 (Framework 13)</strong>, <strong>React 19</strong>, <strong>Tailwind CSS v4</strong>, and <strong>Laravel Sanctum</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.5-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP 8.5" />
  <img src="https://img.shields.io/badge/Laravel-13.x-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel 13" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Database-SQLite_3-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite 3" />
  <img src="https://img.shields.io/badge/Auth-Sanctum-F58025?style=flat-square&logo=laravel&logoColor=white" alt="Sanctum" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**LD-NI-BOS** is a modernized, autonomous-ready platform commerce application originally derived from the university platform-based programming (`project-pbp-uas`) curriculum. It combines a robust Laravel backend with an agile React frontend, designed for zero-friction development and high test velocity without external payment gateway dependencies.

---

## 🚀 Key Features

- **🔐 Token-Based API Authentication**: Powered by Laravel Sanctum with rate-limited registration, login, profile inspection, and token revocation.
- **🏬 Multi-Vendor Store Management**: Vendor registration, isolated product inventory, sales metrics dashboard, and item-level order fulfillment status tracking.
- **🛒 Dynamic Cart & Wishlist**: Persistent shopping cart with calculated subtotal, automatic mock component mapping for PC builder simulations, and wishlisting.
- **⚡ Modern PHP 8.4+ Syntax**: Declarative Eloquent attributes (`#[Fillable]`, `#[Hidden]`), typed properties, and constructor property promotion.
- **🎨 React 19 & Tailwind CSS v4**: Fast Refresh Blade mounting shell (`app.blade.php`), CSS-first `@theme` configuration, and Vite 8 bundling.
- **💳 Unified Checkout Pipeline**: Handles both direct itemized checkouts (React SPA) and atomic cart checkouts with pessimistic inventory locks.
- **📦 Zero-Config SQLite**: File-backed database (`database/database.sqlite`) running out-of-the-box with foreign keys and database-backed sessions, cache, and queues.
- **🧪 Comprehensive Test Suite**: 100% passing automated feature and unit tests with PHPUnit 12 (80 tests, 424 assertions).

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Backend Core** | [Laravel Framework](https://laravel.com/) | `13.35.x` | Application framework, routing, and HTTP kernel |
| **Language Runtime**| [PHP](https://www.php.net/) | `8.5.x` | Backend programming language |
| **Authentication** | [Laravel Sanctum](https://laravel.com/docs/sanctum) | `4.3.x` | Personal access tokens & API authentication |
| **Frontend UI** | [React](https://react.dev/) | `19.3.x` | Dynamic client-side components |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `4.0.x` | Utility-first styling via `@tailwindcss/vite` |
| **Asset Bundler** | [Vite](https://vitejs.dev/) | `8.0.x` | High-speed frontend dev server and production builder |
| **Database** | [SQLite](https://www.sqlite.org/) | `3.54.x` | Zero-dependency relational storage |
| **Code Style** | [Laravel Pint](https://laravel.com/docs/pint) | `1.27.x` | Automated code formatting |
| **Testing** | [PHPUnit](https://phpunit.de/) | `12.5.x` | Unit and feature test runner |

---

## ⚡ Quick Start

### 1. Prerequisites

- **PHP** `^8.3` (or `8.5`) with extensions: `pdo_sqlite`, `openssl`, `mbstring`, `xml`, `curl`
- **Composer** `^2.2`
- **Node.js** `^20.0` or `^26.0` and **npm** `^10.0`

### 2. Installation

```bash
# Clone the repository
git clone <repo-url> ld-ni-bos
cd ld-ni-bos

# Install backend dependencies
composer install

# Install frontend dependencies
npm install

# Setup environment configuration
cp .env.example .env
php artisan key:generate

# Run database migrations and seed catalog & demo accounts
php artisan migrate --seed
```

### 3. Launch Development Servers

Launch the Laravel API server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

In a separate terminal, start the Vite frontend server:

```bash
npm run dev
```

Visit `http://127.0.0.1:8000` in your web browser.

---

## 📡 API Overview

The platform exposes a comprehensive JSON REST API powered by Laravel Sanctum. See the complete [REST API Reference](docs/api-reference.md) for full request/response schemas.

### Authentication Endpoints

| Method | Endpoint | Auth Required | Rate Limit | Description |
|---|---|:---:|:---:|---|
| `POST` | `/api/register` | No | 10 / min | Register customer account and receive token |
| `POST` | `/api/login` | No | 6 / min | Authenticate credentials and receive token |
| `GET` | `/api/user` | `Bearer <token>` | — | Fetch authenticated user profile |
| `POST` | `/api/logout` | `Bearer <token>` | — | Revoke current access token |

> [!NOTE]
> All authentication routes are also aliased under the `/api/auth/*` prefix (e.g., `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`).

### Key Platform Endpoints

| Module | Methods | Endpoints | Description |
|---|---|---|---|
| **Catalog** | `GET` | `/api/categories`, `/api/products`, `/api/products/{slug}` | Browse and search categories and hardware parts |
| **Wishlist** | `GET`, `POST`, `DELETE` | `/api/wishlist`, `/api/wishlist/toggle` | Manage bookmarked products |
| **Cart** | `GET`, `POST`, `PATCH`, `DELETE` | `/api/cart`, `/api/cart/bulk`, `/api/cart/{id}` | Single & bulk items addition (with PC builder mock resolution) |
| **Checkout** | `POST` | `/api/checkout`, `/api/orders/checkout` | Unified itemized direct checkout and cart conversion |
| **Orders** | `GET`, `PATCH` | `/api/orders`, `/api/orders/{id}/cancel` | Customer order history, inspection, and cancellation |
| **Vendor** | `GET`, `POST`, `PATCH`, `DELETE` | `/api/vendor/store`, `/api/vendor/products`, `/api/vendor/orders` | Multi-vendor store profile, catalog, metrics & fulfillment |

---

## 🧪 Testing & Code Standards

### Running Automated Tests

Run the complete 14-suite feature and unit test suite (80 tests, 424 assertions, 100% pass):

```bash
php artisan test --compact
```

Or execute directly via the PHPUnit runner:

```bash
php vendor/bin/phpunit
```

Run only authentication feature tests:

```bash
php artisan test --compact tests/Feature/Auth/
```

### Code Formatting

Format PHP code according to project conventions using Laravel Pint:

```bash
php vendor/bin/pint --dirty --format agent
```

---

## 📚 Documentation Hub

Detailed technical guides and architectural specifications are located in the [docs/](docs/) directory:

- [docs/README.md](docs/README.md) — Documentation index and quick overview
- [docs/api-reference.md](docs/api-reference.md) — Complete REST API endpoint reference for catalog, cart, orders, and vendors
- [docs/api-authentication.md](docs/api-authentication.md) — API bearer token authentication, request formats, and cURL examples
- [docs/architecture.md](docs/architecture.md) — System architecture, request lifecycle, and data flow
- [docs/frontend.md](docs/frontend.md) — React 19 mounting, Tailwind v4 theme, and Vite setup
- [docs/backend.md](docs/backend.md) — Eloquent models, attributes, SQLite schema, and controllers
- [docs/environment-setup.md](docs/environment-setup.md) — Native Android (AGY v2 ARM64) and Linux installation guide
- [docs/development-workflow.md](docs/development-workflow.md) — Laravel Boost guidelines, testing standards, and Git flow
- [docs/PRD & SRS Specification.md](docs/PRD%20&%20SRS%20Specification.md) — Original product requirements and software specification

---

## 📄 License

This software is open-sourced under the [MIT License](LICENSE).