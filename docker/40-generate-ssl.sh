#!/bin/sh
set -e

SSL_DIR="/etc/nginx/ssl"
CERT="$SSL_DIR/fullchain.pem"
KEY="$SSL_DIR/privkey.pem"

mkdir -p "$SSL_DIR"

if [ ! -s "$CERT" ] || [ ! -s "$KEY" ]; then
  echo "No TLS certs in $SSL_DIR; generating self-signed certificate."
  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -subj "/CN=${SSL_CN:-localhost}"
fi
