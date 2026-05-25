#!/bin/sh
set -e

ENV_JS="/usr/share/nginx/html/principles-env.js"

# Values come from the host/EasyPanel environment — never from the git repository.
jq -n \
  --arg first "${FIRST_KEY_OF_PASSWORD_ENCRYPTION:-}" \
  --arg second "${SECOND_KEY_OF_PASSWORD_ENCRYPTION:-}" \
  --arg api "${VITE_API_BASE_URL:-}" \
  --arg site "${VITE_SITE_URL:-https://principles.top}" \
  '{
    FIRST_KEY_OF_PASSWORD_ENCRYPTION: $first,
    SECOND_KEY_OF_PASSWORD_ENCRYPTION: $second,
    VITE_API_BASE_URL: $api,
    VITE_SITE_URL: $site
  }' > /tmp/principles-env.json

printf '%s' 'window.__PRINCIPLES_ENV__ = ' > "$ENV_JS"
cat /tmp/principles-env.json >> "$ENV_JS"
printf '%s\n' ';' >> "$ENV_JS"
rm -f /tmp/principles-env.json
