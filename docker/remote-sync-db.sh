#!/usr/bin/env bash
# 在服务器上执行：将 /tmp/personal-site-db-sync 写入 Docker 卷并重启 api
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE="docker compose -f docker/docker-compose.yml --env-file .env"
BACKUP_TS=$(date +%Y%m%d-%H%M%S)
SYNC_DIR="${1:-/tmp/personal-site-db-sync}"

if [ ! -f "${SYNC_DIR}/prod.db" ]; then
  echo "错误: 未找到 ${SYNC_DIR}/prod.db" >&2
  exit 1
fi

echo "==> 停止 api 容器，避免写入冲突..."
${COMPOSE} stop api

echo "==> 备份并写入 Docker 卷 docker_api-data..."
docker run --rm \
  -v docker_api-data:/data \
  -v "${SYNC_DIR}:/sync:ro" \
  alpine:3.20 sh -c "
    set -eu
    BACKUP_TS='${BACKUP_TS}'
    mkdir -p /data/backup
    if [ -f /data/prod.db ]; then
      cp /data/prod.db \"/data/backup/prod.db.\${BACKUP_TS}\"
    fi
    if [ -d /data/lancedb ]; then
      cp -r /data/lancedb \"/data/backup/lancedb.\${BACKUP_TS}\"
    fi
    cp /sync/prod.db /data/prod.db
    rm -f /data/prod.db-wal /data/prod.db-shm
    if [ -d /sync/lancedb ]; then
      rm -rf /data/lancedb
      cp -r /sync/lancedb /data/lancedb
    fi
    chmod 666 /data/prod.db
  "

rm -rf "${SYNC_DIR}"

echo "==> 启动 api 容器..."
${COMPOSE} up -d api

echo "==> 等待 API 就绪..."
for i in $(seq 1 24); do
  if curl -sf http://127.0.0.1/api/article/list >/dev/null 2>&1; then
    echo "[sync-db] API 已就绪"
    break
  fi
  echo "[sync-db] 等待中 (${i}/24)..."
  sleep 5
done

echo "==> 数据抽样校验..."
${COMPOSE} exec -T api node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
Promise.all([
  p.article.count(),
  p.project.count(),
  p.link.count(),
]).then(([articles, projects, links]) => {
  console.log(JSON.stringify({ articles, projects, links }));
}).finally(() => p.\$disconnect());
"

echo "==> [remote-sync-db] 完成"
