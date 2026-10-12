# Environment & Installation Guide

This guide details the setup and configuration of the development environment across Linux, macOS, and specifically the **Native Android ARM64** environment via Antigravity (AGY v2).

---

## 1. Native Android Environment (Antigravity AGY v2)

The application workspace resides at `/storage/emulated/0/Documents/projects/ld-ni-bos` within an ARM64 Android Linux userspace.

### Essential Environment Variables

Add or ensure these environment variables are exported in your terminal session:

```bash
export PATH="/data/user/0/com.agy/files/usr/bin:$PATH"
export HOME="/data/user/0/com.agy/files"
export GIT_CONFIG_NOSYSTEM=1
```

### Package Management (`pkg`)

AGY includes a native package manager. Install the required runtime packages:

```bash
# Update mirrors and indices:
pkg update

# Install runtime dependencies:
pkg install php composer nodejs npm git unzip
```

### Git Safe Directory Configuration

To avoid permission and system-config warnings on external storage:

```bash
export GIT_CONFIG_NOSYSTEM=1
git config --global --add safe.directory "/storage/emulated/0/Documents/projects/ld-ni-bos"
```

### Android Storage Considerations

1. **File Locking (`flock`) on Emulated Storage**:
   - The `/storage/emulated/0` path is an Android FUSE / sdcardfs filesystem that does not support POSIX `flock` mandatory locks.
   - Composer and tools operating on external storage use fallback mechanisms when advisory locks are bypassed.
2. **Dynamic Linker Namespace for Node Addons**:
   - Android Bionic linker prevents loading native shared libraries (`.node` or `.so`) from shared storage `/storage/emulated/0`.
   - Node tooling should either run pure JavaScript / WASM implementations, or be executed within internal storage (`/data/user/0/com.agy/files`).

---

## 2. Standard Linux / macOS / Windows Setup

For developers running outside Android:

### Prerequisites

- **PHP**: 8.3+ or 8.5
- **Composer**: 2.2+
- **Node.js**: 20.x or higher
- **npm**: 10.x or higher

### Installation Commands

```bash
# 1. Clone repository (if applicable):
git clone <repository-url> ld-ni-bos
cd ld-ni-bos

# 2. Install PHP dependencies:
composer install

# 3. Install frontend dependencies:
npm install

# 4. Initialize environment:
cp .env.example .env
php artisan key:generate

# 5. Run database migrations & seed catalog:
php artisan migrate
php artisan db:seed --class=ProductSeeder
```

---

## 3. Starting Development Servers

### Laravel Artisan Backend Server

Bind to `127.0.0.1` or `localhost` (ports 8000, 8080):

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

> [!NOTE]
> On Android Antigravity, avoid binding to ports `45157` and `45158`, which are reserved for Antigravity core services.

### Vite Development Server (Frontend)

```bash
npm run dev
```

Or build production assets:

```bash
npm run build
```
