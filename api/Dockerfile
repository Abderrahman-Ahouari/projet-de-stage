FROM php:8.2-fpm

# 1) System deps + PHP extensions (unchanged)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
  && docker-php-ext-install pdo pdo_pgsql zip mbstring exif pcntl bcmath

# 2) Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 3) Match host UID for file permissions (unchanged)
RUN usermod -u 1000 www-data
USER www-data

# 4) Expose port 8000 instead of 9000
EXPOSE 8000

# 5) Launch Laravel's built-in server on 0.0.0.0 so it's reachable from outside
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

