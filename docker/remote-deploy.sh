#!/usr/bin/env bash
# 在服务器上执行：构建 Docker、等待就绪、初始化种子
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ROOT}/.env"
COMPOSE="docker compose -f docker/docker-compose.yml --env-file ${ENV_FILE}"

echo "==> [remote] 清理旧路由..."
rm -rf next-host/app/about next-host/app/blog next-host/app/contact \
       next-host/app/links next-host/app/projects
rm -f next-host/app/page.tsx

echo "==> [remote] 停止旧容器（保留数据库卷 docker_api-data，不使用 down -v）..."
${COMPOSE} down 2>/dev/null || true

echo "==> [remote] 构建并启动（可能 15–30 分钟）..."
${COMPOSE} up -d --build

echo "==> [remote] 等待服务就绪..."
chmod +x docker/wait-healthy.sh
docker/wait-healthy.sh

echo "==> [remote] 初始化种子数据（仅空表写入演示数据，已有内容不覆盖）..."
${COMPOSE} exec -T api node dist/prisma/seed.js

echo "==> [remote] 容器状态："
${COMPOSE} ps

echo "==> [remote] 部署完成"
