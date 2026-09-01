#!/bin/bash
# KaoinAI Production Deployment Script
# Webroot: /opt/kaionai-site on VPS

set -e

WEBROOT="/opt/kaionai-site"

echo "=================================================="
echo "  Deploying KaoinAI Production Web Platform"
echo "=================================================="

mkdir -p "$WEBROOT"

if [ -f "kaoinai-website-prod.tar.gz" ]; then
    echo ">>> Extracting production archive into $WEBROOT..."
    tar -xzf kaoinai-website-prod.tar.gz -C "$WEBROOT"
else
    echo ">>> Syncing files directly into $WEBROOT..."
    cp -r * "$WEBROOT/" 2>/dev/null || true
fi

echo ">>> Setting permissions (www-data:www-data)..."
chown -R www-data:www-data "$WEBROOT"
chmod -R 755 "$WEBROOT"

if [ -f "$WEBROOT/nginx.conf" ]; then
    echo ">>> Updating Nginx configuration..."
    cp "$WEBROOT/nginx.conf" /etc/nginx/sites-available/kaoinai
    ln -sf /etc/nginx/sites-available/kaoinai /etc/nginx/sites-enabled/kaoinai
    nginx -t
    systemctl reload nginx
    echo ">>> Nginx reloaded successfully!"
fi

echo "=================================================="
echo "  Deployment Complete! Production is live."
echo "=================================================="
