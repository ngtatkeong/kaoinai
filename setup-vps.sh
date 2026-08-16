#!/bin/bash
# KaoinAI VPS Deployment Script
# Run this on your VPS as root or with sudo

set -e

DOMAIN="kaoinai.com"
EMAIL="tk.ng@kaoinai.com"
WEBROOT="/opt/kaionai-site"

echo "=========================================="
echo "  KaoinAI VPS Setup Script"
echo "=========================================="

# 1. Install dependencies
echo "[1/7] Installing dependencies..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 2. Create web root
echo "[2/7] Creating web root at $WEBROOT..."
mkdir -p $WEBROOT
chown -R www-data:www-data $WEBROOT
chmod -R 755 $WEBROOT

# 3. Copy nginx config
echo "[3/7] Installing nginx configuration..."
cp nginx.conf /etc/nginx/sites-available/kaoinai

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Enable kaoinai site
ln -sf /etc/nginx/sites-available/kaoinai /etc/nginx/sites-enabled/kaoinai

# 4. Test nginx config
echo "[4/7] Testing nginx configuration..."
nginx -t

# 5. Reload nginx (HTTP only for now)
echo "[5/7] Reloading nginx..."
systemctl reload nginx

# 6. Obtain SSL certificate
echo "[6/7] Obtaining SSL certificate from Let's Encrypt..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

# 7. Auto-renewal check
echo "[7/7] Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Upload your website files to: $WEBROOT"
echo "     scp -r /d/kaoinai-website/* root@YOUR_VPS_IP:$WEBROOT/"
echo ""
echo "  2. Set proper ownership:"
echo "     chown -R www-data:www-data $WEBROOT"
echo ""
echo "  3. Your site will be live at:"
echo "     https://$DOMAIN"
echo ""
echo "  4. To check SSL renewal:"
echo "     certbot renew --dry-run"
echo ""
echo "=========================================="
