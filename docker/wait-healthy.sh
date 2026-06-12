#!/bin/sh
# 等待 Nginx / Next.js / API 就绪（在服务器本机执行，最多约 3 分钟）
set -eu

max=36
i=0

while [ "$i" -lt "$max" ]; do
  if curl -sf http://127.0.0.1/ >/dev/null 2>&1 \
    && curl -sf http://127.0.0.1/projects >/dev/null 2>&1 \
    && curl -sf http://127.0.0.1/api/article/list >/dev/null 2>&1 \
    && curl -sf http://127.0.0.1/convenience/ >/dev/null 2>&1; then
    echo "[wait-healthy] 服务已就绪"
    exit 0
  fi
  i=$((i + 1))
  echo "[wait-healthy] 等待中 ($i/$max)..."
  sleep 5
done

echo "[wait-healthy] 超时：服务未就绪" >&2
exit 1
