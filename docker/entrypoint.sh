#!/bin/sh
set -e

# Default Render port to 10000 if not provided
PORT="${PORT:-10000}"
echo "==> Configuring Nginx to listen on port: $PORT"

# Replace ${PORT} placeholder in Nginx config template
if [ -f /etc/nginx/templates/default.conf.template ]; then
    sed "s/\${PORT}/$PORT/g" /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf
fi

# Ensure storage and bootstrap directories exist with correct permissions
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# If SQLite is used, ensure database file exists
if [ "${DB_CONNECTION}" = "sqlite" ] || [ -z "${DB_CONNECTION}" ]; then
    DB_FILE="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
    mkdir -p "$(dirname "$DB_FILE")"
    if [ ! -f "$DB_FILE" ]; then
        echo "==> Creating SQLite database at $DB_FILE"
        touch "$DB_FILE"
    fi
    chown www-data:www-data "$DB_FILE" || true
    chmod 664 "$DB_FILE" || true
fi

# Set directory permissions for web server user
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create public storage symlink if missing
echo "==> Linking storage directory"
php artisan storage:link --force || true

# Discover package manifests
php artisan package:discover --ansi || true

# Production caches (skip if SKIP_OPTIMIZE is set)
if [ "${SKIP_OPTIMIZE}" != "true" ]; then
    echo "==> Caching Laravel configuration, routes, and views"
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Run database migrations (enabled by default on Render)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "==> Running database migrations..."
    php artisan migrate --force || {
        echo "==> WARNING: Migrations failed. Check database connectivity."
    }
fi

# Run database seeders if requested
if [ "${RUN_SEED:-false}" = "true" ]; then
    echo "==> Running database seeders..."
    php artisan db:seed --force || {
        echo "==> WARNING: Database seeding failed."
    }
fi

echo "==> Application ready. Starting Supervisor on port $PORT..."
exec "$@"
