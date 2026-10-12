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
- **⚡ Modern PHP 8.4+ Syntax**: Declarative Eloquent attributes (`#[Fillable]`, `#[Hidden]`), typed properties, and constructor property promotion.
- **🎨 React 19 & Tailwind CSS v4**: Fast Refresh Blade mounting shell (`app.blade.php`), CSS-first `@theme` configuration, and Vite 8 bundling.
- **👥 Role & Permission Ready**: Native `customer` and `admin` roles on the `users` table with helper methods and factory states.
- **📦 Zero-Config SQLite**: File-backed database (`database/database.sqlite`) running out-of-the-box with foreign keys and database-backed sessions, cache, and queues.
- **💳 Simulated Checkout Workflow**: Zero external payment gateway credentials required — orders auto-transition with atomic inventory locks.
- **🧪 Comprehensive Test Suite**: 100% passing automated feature and unit tests with PHPUnit 12.

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

# Run database migrations
php artisan migrate
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

## 📡 API Authentication Reference

All endpoints return standard JSON responses and support JSON payloads (`Content-Type: application/json`, `Accept: application/json`):

| Method | Endpoint | Auth Required | Rate Limit | Description |
|---|---|:---:|:---:|---|
| `POST` | `/api/register` | No | 10 / min | Register customer account and receive token |
| `POST` | `/api/login` | No | 6 / min | Authenticate credentials and receive token |
| `GET` | `/api/user` | `Bearer <token>` | — | Fetch authenticated user profile |
| `POST` | `/api/logout` | `Bearer <token>` | — | Revoke current access token |

> [!NOTE]
> All authentication routes are also aliased under the `/api/auth/*` prefix (e.g., `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`).

---

## 🧪 Testing & Code Standards

### Running Automated Tests

Run the complete feature and unit test suite:

```bash
php artisan test --compact
```

Run only authentication feature tests:

```bash
php artisan test --compact tests/Feature/Auth/
```

### Code Formatting

Format PHP code according to project conventions:

```bash
php vendor/bin/pint --dirty --format agent
```

---

## 📚 Documentation Hub

Detailed technical guides and architectural specifications are located in the [docs/](docs/) directory:

- [docs/README.md](docs/README.md) — Documentation index and quick overview
- [docs/architecture.md](docs/architecture.md) — System architecture, request lifecycle, and data flow
- [docs/frontend.md](docs/frontend.md) — React 19 mounting, Tailwind v4 theme, and Vite setup
- [docs/backend.md](docs/backend.md) — Eloquent models, attributes, SQLite schema, and controllers
- [docs/environment-setup.md](docs/environment-setup.md) — Native Android (AGY v2 ARM64) and Linux installation guide
- [docs/development-workflow.md](docs/development-workflow.md) — Laravel Boost guidelines, testing standards, and Git flow
- [docs/PRD & SRS Specification.md](docs/PRD%20&%20SRS%20Specification.md) — Original product requirements and software specification

---

## 📄 License

This software is open-sourced under the [MIT License](LICENSE).