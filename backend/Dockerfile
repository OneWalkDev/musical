FROM php:8.4-fpm

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    unzip \
    zip \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
  && rm -rf /var/lib/apt/lists/*

# GD は事前に configure してから install
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# PHP拡張のインストール
RUN docker-php-ext-install -j$(nproc) \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    pdo_pgsql \
    zip

# Composerのインストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの設定
WORKDIR /var/www/html

# Composerファイルをコピー
COPY composer.json composer.lock ./

# 依存関係をインストール（開発中なら --no-dev を外すのもアリ）
RUN composer install --no-dev --optimize-autoloader --no-scripts

# アプリケーションコードをコピー
COPY . .

# パーミッション設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel用のPHP設定
RUN echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/uploads.ini

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]