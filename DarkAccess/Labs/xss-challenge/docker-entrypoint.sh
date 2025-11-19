#!/bin/sh
set -e

# Entry point to populate a mounted runtime volume with the built SPA files
# If /usr/share/nginx/html (the mount point) does not contain index.html,
# copy the image-provided build from /usr/share/nginx/html.orig into it.

TARGET="/usr/share/nginx/html"
ORIG="/usr/share/nginx/html.orig"

if [ ! -f "$TARGET/index.html" ]; then
  echo "[entrypoint] populating $TARGET from $ORIG"
  # ensure target exists and is writable
  rm -rf "$TARGET"/* || true
  mkdir -p "$TARGET"
  cp -a "$ORIG/." "$TARGET/"
  echo "[entrypoint] populate complete"
fi

# Exec the CMD (nginx start)
exec "$@"
