#!/usr/bin/env bash
# 仅同步便民相关环境变量到服务器并重启 api 容器（无需全量部署）
# 用法：./docker/sync-convenience-env.sh [服务器IP] [SSH密码]

set -euo pipefail

SERVER_IP="${1:-47.116.30.137}"
SSH_PASS="${2:-}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/opt/personal-site"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCAL_ENV="${PROJECT_ROOT}/nest-server/.env"

if [[ ! -f "$LOCAL_ENV" ]]; then
  echo "错误: 未找到 ${LOCAL_ENV}，请先配置 AMAP_WEB_SERVICE_KEY"
  exit 1
fi

ssh_cmd() {
  if [ -n "$SSH_PASS" ]; then
    expect <<EOF
set timeout 120
spawn ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "$@"
expect {
  "password:" { send "${SSH_PASS}\r"; exp_continue }
  "Password:" { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF
  else
    ssh -o StrictHostKeyChecking=no "${SSH_USER}@${SERVER_IP}" "$@"
  fi
}

read_local_key() {
  local key="$1"
  local line val
  line=$(grep -E "^${key}=" "$LOCAL_ENV" | tail -1 || true)
  [[ -n "$line" ]] || return 1
  val="${line#*=}"
  val="${val%\"}"; val="${val#\"}"
  [[ -n "$val" ]] || return 1
  printf '%s' "$val"
}

AMAP_KEY="$(read_local_key AMAP_WEB_SERVICE_KEY || true)"
if [[ -z "$AMAP_KEY" ]]; then
  echo "错误: nest-server/.env 中未配置 AMAP_WEB_SERVICE_KEY"
  exit 1
fi

echo "==> 同步 AMAP_WEB_SERVICE_KEY 到 ${SSH_USER}@${SERVER_IP}:${REMOTE_DIR}/.env"
ssh_cmd "touch '${REMOTE_DIR}/.env' && (grep -v '^AMAP_WEB_SERVICE_KEY=' '${REMOTE_DIR}/.env' 2>/dev/null || true) > '${REMOTE_DIR}/.env.tmp' && printf '%s=%s\n' 'AMAP_WEB_SERVICE_KEY' '${AMAP_KEY}' >> '${REMOTE_DIR}/.env.tmp' && mv '${REMOTE_DIR}/.env.tmp' '${REMOTE_DIR}/.env'"

echo "==> 重启 api 容器..."
ssh_cmd "cd '${REMOTE_DIR}' && docker compose -f docker/docker-compose.yml --env-file .env up -d api"

echo "==> 完成。可在小程序中重新定位验证 /api/geocode/reverse"
