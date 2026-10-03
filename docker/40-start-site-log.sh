#!/bin/sh
# Start the local log sink before nginx (EasyPanel captures container stdout).
set -e
node /opt/principles-site-log-server.mjs &
