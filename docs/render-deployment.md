# Deploying PC-Store to Render (render.com) with Docker

This guide details how to build, configure, and deploy the **PC-NI-BOS** application (Laravel 12 + React 19 + Tailwind CSS v4) on [Render](https://render.com) using Docker.

---

## 🏗️ Architecture Overview

The production container uses a **multi-stage Docker build**:

```
┌─────────────────────────────────┐
│ Stage 1: node:20-alpine         │
│ - npm ci                        │
│ - npm run build                 │
│ - Compiles React 19 & Tailwind  │
│   into public/build             │
└───────────────┬─────────────────┘
                │ Copies /public/build
┌───────────────▼────────────────────────────────────────┐
│ Stage 2: php:8.4-fpm-alpine (Production Runtime)       │
│ - Nginx (HTTP Reverse Proxy listening on $PORT)        │
│ - PHP 8.4-FPM with OPcache & Database drivers (pgsql,  │
│   mysql, sqlite)                                       │
│ - Composer production dependencies (--no-dev)          │
│ - Supervisord managing both Nginx and PHP-FPM          │
│ - Automated migrations & cache generation on startup   │
└────────────────────────────────────────────────────────┘
```

### Key Render Features Configured
1. **Dynamic Port Binding**: Render automatically injects a `PORT` environment variable (default `10000`). The entrypoint script substitutes this into Nginx configuration on boot.
2. **Reverse Proxy & SSL**: Render terminates SSL at its edge. Laravel is configured with `$middleware->trustProxies(at: '*')` and forces HTTPS in production to avoid mixed-content issues.
3. **Database URL Auto-Detection**: Render provides `DATABASE_URL=postgres://...`. Laravel's database configuration connects to PostgreSQL automatically without manual splitting.
4. **Health Check Endpoint**: Hooks into Laravel 12's native `/up` endpoint for zero-downtime rolling deploys.

---

## 🚀 Deployment Method A: 1-Click Blueprint (`render.yaml`)

The repository includes a `render.yaml` Blueprint that automatically provisions both the Web Service and a managed PostgreSQL database.

1. **Push your code** to GitHub.
2. Go to the [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** ➔ **Blueprint**.
4. Select your `ld-ni-bos` GitHub repository.
5. Render will detect `render.yaml` and display the resources to be created:
   - **Web Service**: `pc-store` (Docker environment)
   - **Database**: `pc-store-db` (PostgreSQL free tier)
6. Click **Apply**.
7. Render will provision the PostgreSQL database, build the Docker container (running Vite and Composer), execute database migrations and seeders, and launch the service at `https://pc-store.onrender.com`.

---

## 🛠️ Deployment Method B: Manual Dashboard Setup

If you prefer configuring resources manually in the Render dashboard:

### Step 1: Create a PostgreSQL Database
1. In the Render Dashboard, click **New +** ➔ **PostgreSQL**.
2. **Name**: `pc-store-db`
3. **Database**: `pcstore`
4. **User**: `pcstore`
5. **Region**: Choose the region closest to your users (e.g., `Oregon (US West)` or `Singapore`).
6. **Plan**: Free (or Starter).
7. Click **Create Database**.
8. Once provisioned, copy the **Internal Database URL** (e.g. `postgres://pcstore:xxxx@dpg-xxxx-a:5432/pcstore`).

### Step 2: Create the Web Service
1. In the Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `pc-store`
   - **Region**: Same region as your database.
   - **Environment**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Health Check Path**: `/up`
   - **Plan**: Free (or Starter).
4. Expand **Advanced** and add the following **Environment Variables**:

| Variable | Value | Description |
|---|---|---|
| `APP_NAME` | `PC Store` | Application display name |
| `APP_ENV` | `production` | Environment mode |
| `APP_DEBUG` | `false` | Disable debug mode in production |
| `APP_KEY` | `base64:...` | Generate with `php artisan key:generate --show` |
| `LOG_CHANNEL` | `stderr` | Pipe logs to Render console |
| `DB_CONNECTION` | `pgsql` | Use PostgreSQL driver |
| `DATABASE_URL` | *(Paste Internal DB URL)* | Render PostgreSQL connection string |
| `RUN_MIGRATIONS` | `true` | Runs `php artisan migrate --force` on boot |
| `RUN_SEED` | `true` | Runs seeders on first deployment (set to `false` afterwards) |
| `SESSION_DRIVER` | `database` | Store sessions in PostgreSQL |
| `CACHE_STORE` | `database` | Store cache in PostgreSQL |
| `QUEUE_CONNECTION` | `database` | Store queue jobs in PostgreSQL |

5. Click **Create Web Service**.

---

## 🧪 Local Verification with Docker Compose

You can verify the entire production Docker setup locally against a PostgreSQL instance:

```bash
# Build and run containers
docker compose up --build

# Access application in browser
open http://localhost:8000
```

To stop:
```bash
docker compose down
```

---

## 🔍 Troubleshooting & Operational Notes

### 1. Render Free Tier Spin-Down
Render's free tier web services spin down after 15 minutes of inactivity. When a new request arrives, Render starts the container within 30-50 seconds. Because our image is optimized (~130MB) and OPcache is enabled, startup is snappy.

### 2. Database Reset on Free Tier SQLite
If you choose not to use PostgreSQL and use SQLite instead, note that Render's container disk is **ephemeral** unless a Render Persistent Disk is attached. Any changes made to SQLite will reset on redeployment. Always use Render's managed PostgreSQL database for persistent storage.

### 3. Re-seeding the Database
Default seeders populate test accounts (admin and customer), hardware categories, and mock catalog products. Once initial deployment is verified, set `RUN_SEED=false` in Render's environment variables to prevent re-seeding on subsequent redeploys.

### 4. Viewing Logs
Because logs are directed to `/dev/stdout` and `/dev/stderr`, you can inspect application logs directly in the **Logs** tab of your Render web service dashboard.
