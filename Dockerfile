# Dockerfile for Pterodactyl Deployment

FROM php:8.0-fpm

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    libwebp-dev \
    && docker-php-ext-install gd \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Command to run the application
CMD ["php-fpm"]