# LD-NI-BOS Documentation

Welcome to the internal documentation for **LD-NI-BOS**, a modern web application built on **Laravel 12 (Framework v13)**, **React 19**, and **Tailwind CSS v4** bundled via **Vite**, featuring **Laravel Sanctum** API token authentication.

This project runs natively on Linux environments, including native Android via the Antigravity (AGY v2) ARM64 userspace sandbox.

---

## 📚 Documentation Table of Contents

| Chapter | File | Description |
|---|---|---|
| **01. System Architecture** | [architecture.md](architecture.md) | High-level system design, application stack, request lifecycle, and data flow. |
| **02. API Reference** | [api-reference.md](api-reference.md) | Complete REST API endpoint reference for catalog, cart, orders, and vendors. |
| **03. API Authentication** | [api-authentication.md](api-authentication.md) | Sanctum bearer token authentication, endpoints, payload formats, and cURL examples. |
| **04. Environment Setup** | [environment-setup.md](environment-setup.md) | Prerequisites, package installation, environment variables, and Android specifics. |
| **05. Frontend Guide** | [frontend.md](frontend.md) | React 19 storefront, PC Builder simulation, Tailwind CSS v4 setup, and Vite. |
| **06. Backend & Database** | [backend.md](backend.md) | Models, multi-vendor schema, order lifecycle, unified checkout, and migrations. |
| **07. Development Workflow** | [development-workflow.md](development-workflow.md) | Coding standards, 14 test suites (80 tests, 424 assertions), and Pint formatting. |
| **08. PRD & SRS Specification** | [PRD & SRS Specification.md](PRD%20&%20SRS%20Specification.md) | Original product requirements and functional specifications. |
| **09. Gap Analysis & Roadmap** | [gap-analysis-and-progress-tracker.md](gap-analysis-and-progress-tracker.md) | Baseline comparison, unimplemented feature catalog, and milestone progress tracker. |

---

## ⚡ Quick Start

### 1. Requirements

- **PHP**: `^8.3` (running on PHP 8.5.1) with extensions: `pdo_sqlite`, `openssl`, `mbstring`, `xml`, `curl`
- **Composer**: `^2.2` (Composer 2.11-dev installed)
- **Node.js & npm**: Node.js `^20.0` or `^26.0`, npm `^10.0`
- **Database**: SQLite (default) or MySQL/PostgreSQL

### 2. Environment Configuration

Copy `.env.example` to `.env` if not already present:

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Migration & Seeding

Run database migrations and populate default accounts (admin & demo customer), categories, and product catalog:

```bash
php artisan migrate --force
php artisan db:seed
```

### 4. Running the Application

Launch the Laravel backend server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Access the application in your browser at `http://127.0.0.1:8000`.

---

## 🛠️ Tech Stack Matrix

```
┌────────────────────────────────────────────────────────┐
│                      Client Layer                      │
│            React 19.3.0  +  Tailwind CSS v4.0          │
└───────────────────────────▲────────────────────────────┘
                            │ Vite Dev / Manifest
┌────────────────────────────────────────────────────────┐
│                  API & Security Layer                  │
│       Laravel Sanctum v4.3  (Bearer Token / SPA Auth)   │
└───────────────────────────▲────────────────────────────┘
                            │ Routing & HTTP Kernel
┌───────────────────────────┴────────────────────────────┐
│                     Application Core                   │
│       Laravel Framework 13.35.0  /  PHP 8.5.1 CLI      │
└───────────────────────────▲────────────────────────────┘
                            │ Eloquent ORM
┌───────────────────────────┴────────────────────────────┐
│                      Storage Layer                     │
│        SQLite 3.54  ('database/database.sqlite')       │
└────────────────────────────────────────────────────────┘
```
