# =============================================================================
# Stage 1: Build Frontend Assets (React 19 + Tailwind CSS v4 via Vite)
# =============================================================================
FROM node:20-alpine AS frontend

WORKDIR /app

# Cache package installation layer
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files required for bundling
COPY vite.config.js ./
COPY resources/ ./resources/
COPY public/ ./public/

# Compile production assets into public/build
RUN npm run build

# =============================================================================
# Stage 2: Production PHP 8.4-FPM + Nginx Runtime (Alpine Linux)
# =============================================================================
FROM php:8.4-fpm-alpine AS runtime

WORKDIR /var/www/html

# Environment settings for container runtime and Composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    PORT=10000

# Install Nginx, Supervisor, git, curl, and native database/system tools
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    bash \
    postgresql-client \
    sqlite

# Install official extension installer helper
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

# Install required PHP extensions for Laravel and database drivers
RUN install-php-extensions \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    pdo_sqlite \
    mbstring \
    zip \
    bcmath \
    opcache \
    intl \
    pcntl

# Install Composer binary from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy configuration files
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy container startup entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Cache Composer dependencies layer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Copy full application source code
COPY . .

# Copy compiled frontend assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Complete optimized Composer autoloader dump
RUN composer dump-autoload --optimize --no-dev

# Ensure storage and bootstrap directories exist with proper permissions
RUN mkdir -p storage/framework/cache \
             storage/framework/sessions \
             storage/framework/views \
             storage/logs \
             bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Render Web Service communicates on dynamic $PORT (default 10000)
EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
