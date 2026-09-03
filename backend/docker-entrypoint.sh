#!/bin/bash
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Create SQLite database if it doesn't exist
touch database/database.sqlite
chown www-data:www-data database/database.sqlite
chmod 775 database/database.sqlite

# Run migrations
php artisan migrate --force

# Cache config and routes for performance
php artisan config:cache
php artisan route:cache

# Start Apache
exec apache2-foreground
