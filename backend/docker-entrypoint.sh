#!/bin/bash
set -e

# .env is handled by Render environment variables, but touch it just in case any package expects it to exist
touch .env

# Create SQLite database if it doesn't exist
touch database/database.sqlite
chown www-data:www-data database/database.sqlite
chmod 775 database/database.sqlite

# Run migrations
php artisan migrate --force

# Discover packages (since we bypassed scripts during composer install)
php artisan package:discover --ansi

# (Skipping config and route caching to prevent issues with env variables and permissions in Render)

# Start Apache
exec apache2-foreground
