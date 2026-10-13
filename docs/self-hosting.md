# Self-Hosting PC-Store with Docker

This guide explains how to run and self-host the **PC-NI-BOS** application on any server, VPS (DigitalOcean, Hetzner, AWS, Linode), or local machine using the pre-packaged Docker container published by GitHub Actions.

---

## 📦 Container Registry

The application is automatically built and published by GitHub Actions to **GitHub Container Registry (GHCR)**:

```text
ghcr.io/<github-username-or-org>/<repo-name>:latest
```

Tagged versions are also published on every git tag (e.g. `:v1.0.0`, `:main`, `:sha-xxxxxxx`).

---

## 🚀 Quick Start: Running with a Single Docker Command (SQLite)

For personal hosting, quick demos, or lightweight instances using SQLite:

```bash
docker run -d \
  --name pc-store \
  --restart unless-stopped \
  -p 8080:10000 \
  -e APP_NAME="PC Store" \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_KEY="base64:$(openssl rand -base64 32)" \
  -e DB_CONNECTION=sqlite \
  -e RUN_MIGRATIONS=true \
  -e RUN_SEED=true \
  -v pc_store_db:/var/www/html/database \
  -v pc_store_uploads:/var/www/html/storage/app/public \
  ghcr.io/<owner>/<repo>:latest
```

The application will be accessible at `http://<your-server-ip>:8080`.

---

## 🐘 Production Setup: Self-Hosting with Docker Compose (PostgreSQL)

For production self-hosting with persistent PostgreSQL database and automated health checks:

### 1. Create `docker-compose.prod.yml`

```yaml
services:
  app:
    image: ghcr.io/<owner>/<repo>:latest
    container_name: pc_store_app
    restart: unless-stopped
    ports:
      - "8080:10000"
    environment:
      - APP_NAME=PC Store
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_KEY=${APP_KEY}
      - APP_URL=http://localhost:8080
      - LOG_CHANNEL=stderr
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=pcstore
      - DB_USERNAME=pcstore
      - DB_PASSWORD=${DB_PASSWORD}
      - RUN_MIGRATIONS=true
      - RUN_SEED=${RUN_SEED:-false}
    volumes:
      - app_storage:/var/www/html/storage/app/public
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: pc_store_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: pcstore
      POSTGRES_USER: pcstore
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pcstore -d pcstore"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  app_storage:
```

### 2. Create `.env`

```env
APP_KEY=base64:YOUR_GENERATED_32_BYTE_KEY
DB_PASSWORD=your_secure_postgres_password
RUN_SEED=true
```

*(Generate `APP_KEY` with `echo "base64:$(openssl rand -base64 32)"`)*

### 3. Launch Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔒 Adding Nginx / Cloudflare / Traefik Reverse Proxy & SSL

If you run behind a reverse proxy (like Nginx, Caddy, Traefik, or Cloudflare SSL):
- Map your proxy to `http://127.0.0.1:8080`.
- The container already trusts reverse proxy headers (`X-Forwarded-Proto`, `X-Forwarded-For`) and forces HTTPS when `APP_ENV=production`.
